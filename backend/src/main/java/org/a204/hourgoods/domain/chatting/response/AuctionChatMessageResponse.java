package org.a204.hourgoods.domain.chatting.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "경매 단체 채팅방 참여자에게 보낼 메시지")
public class AuctionChatMessageResponse {

    @Schema(description = "유저 닉네임")
    private String nickname;

    @Schema(description = "유저 이미지 url")
    private String imageUrl;

    @Schema(description = "보낸 시간")
    private String sendTime;

    @Schema(description = "채팅 내용")
    private String content;

}
