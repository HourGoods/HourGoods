package org.a204.hourgoods.domain.deal.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
@Schema(description = "아워 경매 입장 정보 반환")
public class GameAuctionEntryResponse {
	@Schema(description = "판매자가 정한 최소 입찰 금액")
	private Integer minimumPrice;
	@Schema(description = "현재 경매 참가자 수")
	private Integer participantCount;
}
