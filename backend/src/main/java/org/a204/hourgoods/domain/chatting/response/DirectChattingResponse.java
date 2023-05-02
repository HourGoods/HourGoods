package org.a204.hourgoods.domain.chatting.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "1:1 채팅 정보 응답")
public class DirectChattingResponse {

    @Schema(description = "거래 제목")
    private String title;

    @Schema(description = "시작 시간")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm", timezone = "Asia/Seoul")
    private LocalDateTime startTime;

    @Schema(description = "가격")
    private Integer price;

    @Schema(description = "채팅룸 id")
    private Long DirectChattingRoomId;

}
