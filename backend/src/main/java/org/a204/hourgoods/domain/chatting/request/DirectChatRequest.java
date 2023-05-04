package org.a204.hourgoods.domain.chatting.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Schema(description = "1:1 채팅 요청")
public class DirectChatRequest {

    @NotNull
    @Positive
    @Schema(description = "채팅 걸고 싶은 유저의 id")
    private Long receiverId;

    @NotNull
    @Positive
    @Schema(description = "거래 id")
    private Long dealId;

}
