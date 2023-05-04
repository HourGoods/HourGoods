package org.a204.hourgoods.domain.chatting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a204.hourgoods.domain.chatting.entity.DirectMessage;
import org.a204.hourgoods.domain.chatting.request.DirectChatRequest;
import org.a204.hourgoods.domain.chatting.request.DirectChattingRoomRequest;
import org.a204.hourgoods.domain.chatting.request.ChatMessageRequest;
import org.a204.hourgoods.domain.chatting.request.MyDirectChatResponse;
import org.a204.hourgoods.domain.chatting.response.AuctionChatMessageResponse;
import org.a204.hourgoods.domain.chatting.response.DirectChattingResponse;
import org.a204.hourgoods.domain.chatting.response.DirectMessageResponse;
import org.a204.hourgoods.domain.chatting.service.ChattingService;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.global.common.BaseResponse;
import org.a204.hourgoods.global.error.GlobalErrorCode;
import org.a204.hourgoods.global.security.annotation.PreAuthorizeMember;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
@Tag(name = "Chatting", description = "채팅하기 관련 API")
@Slf4j
public class ChattingController {

    private final ChattingService chattingService;
    private final SimpMessageSendingOperations simpMessageSendingOperations;

    /**
     * 거래(Trade)에서 디테일 페이지에서 1:1 채팅방에 대한 정보를 받는 API
     *
     * @param memberDetails 로그인 유저에 대한 정보(자동)
     * @param request       receiverId, senderId, dealId
     * @return 거래에 대한 간단한 정보와 채팅룸 아이디 반환
     */

    @Operation(summary = "(디테일 페이지에서) 1:1 채팅 요청 API", description = "디테일페이지에서는 chattingRoomId가 따로 없으므로 처음 채팅을 하는 경우 채팅방 신규 생성, 이미 채팅한 적이 있으면 기존 채팅방 반환")
    @ApiResponse(responseCode = "200", description = "채팅방 생성 성공", content = @Content(schema = @Schema(implementation = Long.class)))
    @ApiResponse(responseCode = "404", description = "1. CH100 채팅을 요청한 상대 정보 찾을 수 없음 \t\n 2. D200 거래를 찾을 수 없음 \t\n 3.M300 유저 정보가 잘못되었음")
    @PostMapping("/direct")
    @PreAuthorizeMember
    public BaseResponse<DirectChattingResponse> enterDirectChatRoom(@AuthenticationPrincipal MemberDetails memberDetails, @RequestBody DirectChatRequest request) {
        DirectChattingRoomRequest chattingRoomRequest = DirectChattingRoomRequest.builder()
                .dealId(request.getDealId())
                .receiverId(request.getReceiverId())
                .senderId(memberDetails.getMember().getId())
                .build();
        // 이미 기존에 채팅한 이력이 있다면 해당 방을 바로 리턴
        DirectChattingResponse directChattingResponse = chattingService.renterDirectChatting(chattingRoomRequest);
        if (directChattingResponse == null) {
            // 기존에 채팅 이력 없다면 신규로 방을 생성하여 리턴
            directChattingResponse = chattingService.createChattingRoom(chattingRoomRequest);
        }
        return new BaseResponse<>(directChattingResponse);
    }

    /**
     * 채팅룸id에 해당하는 채팅 내용 반환하는 API
     *
     * @param memberDetails  자동으로 입력
     * @param chattingRoomId directChattingRoomId
     * @param pageable       자동으로 입력
     * @return List<DirectMessageResponse> DM 내용 반환
     */
    @Operation(summary = "채팅 내용 가져오기 API", description = "채팅룸에 해당하는 채팅 목록 가져오기")
    @ApiResponse(responseCode = "200", description = "채팅 내용 조회 성공", content = @Content(schema = @Schema(implementation = DirectMessageResponse.class)))
    @GetMapping("/{chattingRoomId}/messages")
    @PreAuthorizeMember
    public BaseResponse<List<DirectMessageResponse>> getMessagesByRoomId(@AuthenticationPrincipal MemberDetails memberDetails, @PathVariable Long chattingRoomId, @PageableDefault(sort = "sendTime", direction = Sort.Direction.ASC) Pageable pageable) {
        List<DirectMessageResponse> messages = chattingService.findAllMessagesByRoomId(memberDetails.getMember().getId(), chattingRoomId, pageable);
        return new BaseResponse<>(messages);
    }

    /**
     * 유저 정보를 기반으로 채팅목록을 반환하는 API
     *
     * @param memberDetails 자동으로 입력
     * @return List<MyDirectChatResponse> 내 채팅 목록 반환
     */

    @Operation(summary = "나의 채팅 목록 가져오기 API", description = "유저 정보를 기준으로 속해 있는 채팅방 목록 가져오기")
    @ApiResponse(responseCode = "200", description = "채팅방 목록 조회 성공", content = @Content(schema = @Schema(implementation = MyDirectChatResponse.class)))
    @GetMapping("/list")
    @PreAuthorizeMember
    public BaseResponse<List<MyDirectChatResponse>> getMyChatList(@AuthenticationPrincipal MemberDetails memberDetails) {
        List<MyDirectChatResponse> result = chattingService.findChatLogByUserId(memberDetails);
        return new BaseResponse<>(result);
    }

    // ==================== WebSocket관련 ===================== //

    /**
     * 채팅을 받아서 Redis에 저장 후, 채널을 구독 중인 사람들에게 메시지 전송
     *
     * @return 성공시 Success code return
     */
    @MessageMapping(value = "/messages/direct")
    public BaseResponse<Void> sendDirectMessage(final ChatMessageRequest request) {
        // 채팅 받은 것을 Redis에 저장
        DirectMessage directMessage = chattingService.saveDirectMessage(request);
        // DB 채팅의 마지막 로그 내용 업데이트
        chattingService.updateChattingLastLog(request.getChattingRoomId(), request.getContent(), request.getSendTime(), directMessage.getId());
        // 채널 구독 중인 다른 사람들에게 메시지 전송
        simpMessageSendingOperations.convertAndSend(
                "/queue/chat/rooms/enter/direct/" + request.getChattingRoomId(),
                request);
        return new BaseResponse<>(GlobalErrorCode.SUCCESS);
    }

    /**
     * 경매 그룹 채팅방에 메시지를 보내는 요청, 채널을 구독 중인 사람들에게 메시지 전송
     * 별도 로그를 Redis 등에 저장하지 않음
     *
     * @param request userId, nickname, chattingRoomId, sendTime, content
     */
    @MessageMapping("/messages/group")
    public void sendAuctionChatMessage(final ChatMessageRequest request) {
        // 응답 정보로 변환하여 옥션 채널 구독 중인 다른 사람들에게 메시지 전송
        AuctionChatMessageResponse response = chattingService.convertChatRequest(request);

        simpMessageSendingOperations.convertAndSend(
                "/topic/chat/rooms/enter/group/" + request.getChattingRoomId(),
                response);
    }


}
