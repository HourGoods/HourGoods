package org.a204.hourgoods.domain.chatting.service;

import lombok.RequiredArgsConstructor;
import org.a204.hourgoods.domain.chatting.entity.DirectChattingRoom;
import org.a204.hourgoods.domain.chatting.entity.DirectMessage;
import org.a204.hourgoods.domain.chatting.exception.DirectChattingRoomNotFoundException;
import org.a204.hourgoods.domain.chatting.exception.ReceiverNotFoundException;
import org.a204.hourgoods.domain.chatting.repository.DirectChattingRoomRepository;
import org.a204.hourgoods.domain.chatting.repository.DirectMessageRepository;
import org.a204.hourgoods.domain.chatting.request.ChatMessageRequest;
import org.a204.hourgoods.domain.chatting.request.DirectChattingRoomRequest;
import org.a204.hourgoods.domain.chatting.response.DirectChattingResponse;
import org.a204.hourgoods.domain.chatting.response.DirectMessageResponse;
import org.a204.hourgoods.domain.deal.entity.Trade;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.repository.TradeRepository;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.exception.MemberNotFoundException;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChattingService {

    private final DirectMessageRepository directMessageRepository;
    private final DirectChattingRoomRepository directChattingRoomRepository;
    private final MemberRepository memberRepository;
    private final TradeRepository tradeRepository;
    private final RedisTemplate<String, DirectMessage> redisTemplate;

    // 1:1 채팅방 재접속하기
    @Transactional(readOnly = true)
    public DirectChattingResponse renterDirectChatting(DirectChattingRoomRequest request) {
        // 거래 정보 가져오기
        Trade trade = getTrade(request.getDealId());
        // receiver id가 유효하지 않으면 예외처리
        if (!checkValidMember(request.getReceiverId())) {
            throw new ReceiverNotFoundException();
        }
        // 방이 없다면 null, 방이 있으면 정보 담아서 반환
        Optional<DirectChattingRoom> chattingRoom = directChattingRoomRepository.findChattingRoomBySenderIdAndReceiverIdAndDealId(request.getSenderId(), request.getReceiverId(), request.getDealId());
        if (chattingRoom.isEmpty()) {
            return null;
        } else {
            return DirectChattingResponse.builder()
                    .title(trade.getTitle())
                    .price(trade.getPrice())
                    .startTime(trade.getStartTime())
                    .DirectChattingRoomId(chattingRoom.get().getId())
                    .build();
        }
    }

    // 1:1 신규 채팅방 만들기
    @Transactional
    public DirectChattingResponse createChattingRoom(DirectChattingRoomRequest request) {
        // 거래 정보 가져오기
        Trade trade = getTrade(request.getDealId());
        // receiver, sender 정보 가져오기
        Member receiver = memberRepository.findById(request.getReceiverId())
                .orElseThrow(ReceiverNotFoundException::new);
        Member sender = memberRepository.findById(request.getSenderId())
                .orElseThrow(MemberNotFoundException::new);
        DirectChattingRoom saveRoom = directChattingRoomRepository.save(
                DirectChattingRoom.builder()
                        .deal(trade)
                        .receiver(receiver)
                        .sender(sender)
                        .build());
        return DirectChattingResponse.builder()
                .price(trade.getPrice())
                .startTime(trade.getStartTime())
                .DirectChattingRoomId(saveRoom.getId())
                .build();
    }

    // 채팅방 이전 메시지목록 가져오기
    @Transactional(readOnly = true)
    public List<DirectMessageResponse> findAllMessagesByRoomId(Long memberId, Long chattingRoomId, Pageable pageable) {
        Member user = memberRepository.findById(memberId)
                .orElseThrow(MemberNotFoundException::new);
        List<DirectMessage> messages = directMessageRepository.findDirectMessagesByChatRoomId(String.valueOf(chattingRoomId), pageable);

        List<DirectMessageResponse> response = new ArrayList<>();
        for (DirectMessage message : messages) {
            boolean flag = user.getNickname().equals(message.getUserNickName());
            response.add(DirectMessageResponse.builder()
                    .nickname(message.getUserNickName())
                    .isUser(flag)
                    .sendTime(message.getSendTime())
                    .content(message.getContent())
                    .build());
        }
        return response;
    }

    // 1:1 채팅 내용 저장하기
    @Transactional
    public DirectMessage saveDirectMessage(ChatMessageRequest request) {
        Member user = memberRepository.findById(request.getUserId())
                .orElseThrow(MemberNotFoundException::new);
        ListOperations<String, DirectMessage> dmListOperations = redisTemplate.opsForList();

        DirectMessage directMessage = DirectMessage.builder()
                .chattingRoomId(String.valueOf(request.getChattingRoomId()))
                .userId(String.valueOf(user.getId()))
                .userNickName(user.getNickname())
                .sendTime(request.getSendTime())
                .content(request.getContent())
                .build();
        dmListOperations.rightPush(String.valueOf(request.getChattingRoomId()), directMessage);

        return directMessageRepository.save(Objects.requireNonNull(directMessage));
    }

    // 채팅룸의 마지막 로그 업데이트
    @Transactional
    public void updateChattingLastLog(Long chattingRoomId, String lastLogContent, String lastLogTime, String lastLogId) {
        DirectChattingRoom directChattingRoom = directChattingRoomRepository.findById(chattingRoomId)
                .orElseThrow(DirectChattingRoomNotFoundException::new);
        directChattingRoom.updateLastLog(lastLogContent, lastLogTime, lastLogId);
    }

    // 거래 정보 가져오기
    private Trade getTrade(Long dealId) {
        return tradeRepository.findById(dealId)
                .orElseThrow(DealNotFoundException::new);
    }

    // 멤버 정보 확인하기
    private boolean checkValidMember(Long memberId) {
        return memberRepository.existsById(memberId);
    }

}
