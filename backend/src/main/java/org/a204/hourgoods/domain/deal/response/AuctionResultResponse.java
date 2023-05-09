package org.a204.hourgoods.domain.deal.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "경매 결과 조회")
public class AuctionResultResponse {
	@Schema(description = "낙찰 여부", example = "true")
	private Boolean isWinner;

	@Schema(description = "응찰자 수", example = "5")
	private Integer bidderCount;

	@Schema(description = "응찰가", example = "100000")
	private Integer bidAmount;

	@Schema(description = "최고 낙찰가 (본인이 낙찰자가 아닌 경우)", example = "150000")
	private Integer winnerAmount;
}
