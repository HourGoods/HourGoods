package org.a204.hourgoods.domain.chatting.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.a204.hourgoods.domain.chatting.entity.DirectChattingRoom;
import org.a204.hourgoods.domain.chatting.entity.DirectMessage;
import org.a204.hourgoods.domain.chatting.exception.DirectChattingRoomNotFoundException;
import org.a204.hourgoods.domain.chatting.exception.ReceiverNotFoundException;
import org.a204.hourgoods.domain.chatting.model.ChatMessageRequest;
import org.a204.hourgoods.domain.chatting.repository.DirectChattingRoomQueryDslRepository;
import org.a204.hourgoods.domain.chatting.repository.DirectChattingRoomRepository;
import org.a204.hourgoods.domain.chatting.repository.DirectMessageRepository;
import org.a204.hourgoods.domain.chatting.request.DirectChattingRoomRequest;
import org.a204.hourgoods.domain.chatting.response.AuctionChatMessageResponse;
import org.a204.hourgoods.domain.chatting.response.DirectChattingResponse;
import org.a204.hourgoods.domain.chatting.response.DirectMessageResponse;
import org.a204.hourgoods.domain.chatting.response.MyDirectChatResponse;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.repository.DealRepository;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.domain.member.exception.MemberNotFoundException;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ChattingService {

	private final DirectMessageRepository directMessageRepository;
	private final DirectChattingRoomRepository directChattingRoomRepository;
	private final DirectChattingRoomQueryDslRepository directChattingRoomQueryDslRepository;
	private final MemberRepository memberRepository;
	private final DealRepository dealRepository;
	private final RedisTemplate<String, DirectMessage> redisTemplate;

	// 1:1 채팅방 재접속하기
	@Transactional(readOnly = true)
	public DirectChattingResponse renterDirectChatting(DirectChattingRoomRequest request) {
		// 거래 정보 가져오기
		if (dealRepository.findById(request.getDealId()).isEmpty()) {
			throw new DealNotFoundException();
		}
		// receiver id가 유효하지 않으면 예외처리
		if (!checkValidMember(request.getReceiverNickname())) {
			throw new ReceiverNotFoundException();
		}
		// 방이 없다면 null, 방이 있으면 정보 담아서 반환
		Optional<DirectChattingRoom> chattingRoom = directChattingRoomRepository.findChattingRoomBySenderIdAndReceiverNicknameAndDealId(
			request.getSenderId(), request.getReceiverNickname(), request.getDealId());
		if (chattingRoom.isEmpty()) {
			return null;
		} else {
			return DirectChattingResponse.builder()
				.directChattingRoomId(chattingRoom.get().getId())
				.build();
		}
	}

	// 1:1 신규 채팅방 만들기
	@Transactional
	public DirectChattingResponse createChattingRoom(DirectChattingRoomRequest request) {
		// 거래 정보 가져오기
		Deal deal = dealRepository.findById(request.getDealId()).orElseThrow(DealNotFoundException::new);
		// receiver, sender 정보 가져오기
		Member receiver = memberRepository.findByNickname(request.getReceiverNickname())
			.orElseThrow(ReceiverNotFoundException::new);
		Member sender = memberRepository.findById(request.getSenderId())
			.orElseThrow(MemberNotFoundException::new);
		DirectChattingRoom saveRoom = directChattingRoomRepository.save(
			DirectChattingRoom.builder()
				.deal(deal)
				.receiver(receiver)
				.sender(sender)
				.build());
		// Redis 저장소에 기존에 저장된 관련없는 채팅 로그 삭제
		deleteDirectMessagesByChattingRoomId(saveRoom.getId().toString());
		return DirectChattingResponse.builder()
			.directChattingRoomId(saveRoom.getId())
			.build();
	}

	// 채팅방 이전 메시지목록 가져오기
	@Transactional(readOnly = true)
	public List<DirectMessageResponse> findAllMessagesByRoomId(Long memberId, Long chattingRoomId) {
		Member user = memberRepository.findById(memberId)
			.orElseThrow(MemberNotFoundException::new);
		List<DirectMessage> messages = directMessageRepository.findDirectMessagesByChattingRoomIdOrderBySendTimeAsc(
			String.valueOf(chattingRoomId));

		List<DirectMessageResponse> response = new ArrayList<>();
		for (DirectMessage message : messages) {
			boolean flag = user.getNickname().equals(message.getSenderNickname());
			response.add(DirectMessageResponse.builder()
				.nickname(message.getSenderNickname())
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
		Member user = memberRepository.findByNickname(request.getNickname())
			.orElseThrow(MemberNotFoundException::new);
		ListOperations<String, DirectMessage> dmListOperations = redisTemplate.opsForList();

		DirectMessage directMessage = DirectMessage.builder()
			.chattingRoomId(String.valueOf(request.getChattingRoomId()))
			.senderId(String.valueOf(user.getId()))
			.senderNickname(user.getNickname())
			.sendTime(request.getSendTime())
			.content(request.getContent())
			.build();
		dmListOperations.rightPush(String.valueOf(request.getChattingRoomId()), directMessage);

		return directMessageRepository.save(Objects.requireNonNull(directMessage));
	}

	// 채팅룸의 마지막 로그 업데이트
	@Transactional
	public void updateChattingLastLog(Long chattingRoomId, String lastLogContent, String lastLogTime,
		String lastLogId) {
		DirectChattingRoom directChattingRoom = directChattingRoomRepository.findById(chattingRoomId)
			.orElseThrow(DirectChattingRoomNotFoundException::new);
		directChattingRoom.updateLastLog(lastLogContent, lastLogTime, lastLogId);
	}

	// 그룹 채팅방에게 보낼 정보를 담아 보내기
	@Transactional(readOnly = true)
	public AuctionChatMessageResponse convertChatRequest(ChatMessageRequest request) {
		Member user = memberRepository.findByNickname(request.getNickname())
			.orElseThrow(MemberNotFoundException::new);

		return AuctionChatMessageResponse.builder()
			.nickname(user.getNickname())
			.imageUrl(user.getImageUrl())
			.content(request.getContent())
			.sendTime(request.getSendTime())
			.build();
	}

	// 내 채팅 기록 목록 반환
	@Transactional(readOnly = true)
	public List<MyDirectChatResponse> findChatLogByUserId(MemberDetails memberDetails) {
		Member user = memberRepository.findById(memberDetails.getMember().getId())
			.orElseThrow(MemberNotFoundException::new);
		List<DirectChattingRoom> directChattingRooms = directChattingRoomQueryDslRepository.searchAllChatListByUserId(
			user.getId());
		List<MyDirectChatResponse> result = new ArrayList<>();
		for (DirectChattingRoom directChattingRoom : directChattingRooms) {
			String otherImageUrl;
			String otherNickname;
			if (directChattingRoom.getSender().getId().equals(user.getId())) {
				otherImageUrl = directChattingRoom.getReceiver().getImageUrl();
				otherNickname = directChattingRoom.getReceiver().getNickname();
			} else {
				otherImageUrl = directChattingRoom.getSender().getImageUrl();
				otherNickname = directChattingRoom.getSender().getNickname();
			}
			result.add(MyDirectChatResponse.builder()
				.chattingRoomId(directChattingRoom.getId())
				.otherImageUrl(otherImageUrl)
				.otherNickname(otherNickname)
				.lastLogContent(directChattingRoom.getLastLogContent())
				.lastLogTime(directChattingRoom.getLastLogTime())
				.dealId(directChattingRoom.getDeal().getId())
				.build());
		}
		return result;
	}

	// 멤버 정보 확인하기
	private boolean checkValidMember(String memberNickname) {
		return memberRepository.existsByNickname(memberNickname);
	}

	// 특정 chattingRoomId에 해당하는 값을 삭제하는 메서드
	public void deleteDirectMessagesByChattingRoomId(String chattingRoomId) {
		SetOperations<String, DirectMessage> setOperations = redisTemplate.opsForSet();

		// Redis에서 특정 chattingRoomId에 해당하는 모든 DirectMessage를 조회
		Set<DirectMessage> directMessages = setOperations.members("chatRedis:" + chattingRoomId);

		// 조회된 DirectMessage를 삭제
		if (directMessages != null) {
			for (DirectMessage directMessage : directMessages) {
				setOperations.remove("chatRedis:" + chattingRoomId, directMessage);
			}
		}
	}

}
