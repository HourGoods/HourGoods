package org.a204.hourgoods.domain.deal.response;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "경매 입장 정보 반환")
public class AuctionEntryResponse {
    @Schema(description = "현재 최고가")
    private Integer currentBid;
    @Schema(description = "현재 참가자 수")
    private Integer participantCount;
    @Schema(description = "경매장 타이머 동기화를 위한 현재 서버 시간")
    private LocalDateTime currentTime;
}
