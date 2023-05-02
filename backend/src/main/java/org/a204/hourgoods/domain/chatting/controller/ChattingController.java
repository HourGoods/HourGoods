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
import org.a204.hourgoods.domain.chatting.service.ChattingService;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.global.common.BaseResponse;
import org.a204.hourgoods.global.security.annotation.PreAuthorizeMember;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
@Tag(name = "Chatting", description = "채팅하기 관련 API")
@Slf4j
public class ChattingController {

    private final ChattingService chattingService;

    @Operation(summary = "1:1 채팅하기 API", description = "처음 채팅을 하는 경우 채팅방 신규 생성, 이미 채팅한 적이 있으면 기존 채팅방 반환")
    @ApiResponse(responseCode = "200", description = "채팅방 생성 성공", content = @Content(schema = @Schema(implementation = Long.class)))
    @GetMapping("/direct")
    @PreAuthorizeMember
    public BaseResponse<DirectChattingResponse> createDirectChatRoom(@AuthenticationPrincipal MemberDetails memberDetails, @RequestBody DirectChatRequest request) {
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

}
