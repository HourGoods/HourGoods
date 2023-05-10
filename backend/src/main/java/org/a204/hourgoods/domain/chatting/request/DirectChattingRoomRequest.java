package org.a204.hourgoods.domain.chatting.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Schema(description = "1:1 채팅룸을 찾기 위한 내부 DTO")
public class DirectChattingRoomRequest {

    @NotNull
    @Positive
    @Schema(description = "채팅 걸고 싶은 유저의 id")
    private String receiverNickname;

    @NotNull
    @Positive
    @Schema(description = "거래 id")
    private Long dealId;

    @NotNull
    @Positive
    @Schema(description = "채팅 거는 유저의 id")
    private Long senderId;

}
