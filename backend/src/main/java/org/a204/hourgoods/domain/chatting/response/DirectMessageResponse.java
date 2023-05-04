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
@Schema(description = "채팅 내용")
public class DirectMessageResponse {

    @Schema(description = "유저 닉네임")
    private String nickname;

    @Schema(description = "본인 여부")
    private Boolean isUser;

    @Schema(description = "보낸 시간")
    private String sendTime;

    @Schema(description = "채팅 내용")
    private String content;

}
