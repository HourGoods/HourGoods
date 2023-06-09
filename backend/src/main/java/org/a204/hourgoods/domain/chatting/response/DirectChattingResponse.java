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
@Schema(description = "1:1 채팅 정보 응답")
public class DirectChattingResponse {
    @Schema(description = "채팅룸 id")
    private Long directChattingRoomId;
}
