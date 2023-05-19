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
@Schema(description = "내 채팅 내용 요약")
public class MyDirectChatResponse {

    @Schema(description = "채팅방 id")
    private Long chattingRoomId;

    @Schema(description = "상대방 닉네임")
    private String otherNickname;

    @Schema(description = "상대방 프로필 이미지")
    private String otherImageUrl;

    @Schema(description = "마지막 대화 내용")
    private String lastLogContent;

    @Schema(description = "마지막 시간")
    private String lastLogTime;

    @Schema(description = "연관된 거래 id")
    private Long dealId;

}
