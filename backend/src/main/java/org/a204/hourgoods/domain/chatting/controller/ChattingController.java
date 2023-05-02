package org.a204.hourgoods.domain.chatting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a204.hourgoods.domain.chatting.request.DirectChatRequest;
import org.a204.hourgoods.domain.chatting.request.DirectChattingRoomRequest;
import org.a204.hourgoods.domain.chatting.response.DirectChattingResponse;
import org.a204.hourgoods.domain.chatting.response.DirectMessageResponse;
import org.a204.hourgoods.domain.chatting.service.ChattingService;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.global.common.BaseResponse;
import org.a204.hourgoods.global.security.annotation.PreAuthorizeMember;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
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

    /**
     * 거래(Trade)에서 1:1 채팅방에 대한 정보를 받는 API
     *
     * @param memberDetails 로그인 유저에 대한 정보(자동)
     * @param request       receiverId, senderId, dealId
     * @return 거래에 대한 간단한 정보와 채팅룸 아이디 반환
     */

    @Operation(summary = "1:1 채팅하기 API", description = "처음 채팅을 하는 경우 채팅방 신규 생성, 이미 채팅한 적이 있으면 기존 채팅방 반환")
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

    @Operation(summary = "채팅 내용 가져오기 API", description = "채팅룸에 해당하는 채팅 목록 가져오기")
    @ApiResponse(responseCode = "200", description = "채팅 내용 조회 성공", content = @Content(schema = @Schema(implementation = DirectMessageResponse.class)))
    @GetMapping("/chat/{chattingRoomId}/messages")
    @PreAuthorizeMember
    public BaseResponse<List<DirectMessageResponse>> getMessagesByRoomId(@AuthenticationPrincipal MemberDetails memberDetails, @PathVariable Long chattingRoomId, @PageableDefault(sort = "sendTime", direction = Sort.Direction.ASC) Pageable pageable) {
        List<DirectMessageResponse> messages = chattingService.findAllMessagesByRoomId(memberDetails.getMember().getId(), chattingRoomId, pageable);
        return new BaseResponse<>(messages);
    }
}
