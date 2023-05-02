package org.a204.hourgoods.domain.chatting.service;

import lombok.RequiredArgsConstructor;
import org.a204.hourgoods.domain.chatting.entity.DirectChattingRoom;
import org.a204.hourgoods.domain.chatting.exception.ReceiverNotFoundException;
import org.a204.hourgoods.domain.chatting.repository.DirectChattingRoomRepository;
import org.a204.hourgoods.domain.chatting.request.DirectChattingRoomRequest;
import org.a204.hourgoods.domain.chatting.response.DirectChattingResponse;
import org.a204.hourgoods.domain.deal.entity.Trade;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.repository.TradeRepository;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.exception.MemberNotFoundException;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChattingService {

    private final DirectChattingRoomRepository directChattingRoomRepository;
    private final MemberRepository memberRepository;
    private final TradeRepository tradeRepository;

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
