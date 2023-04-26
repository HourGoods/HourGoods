package org.a204.hourgoods.domain.deal.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Schema(description = "콘서트별 거래 목록 조회 요청")
public class ConcertDealListRequest {

	@NotNull
	@Positive
	@Schema(name = "해당하는 콘서트 id")
	private Long concertId;

	@NotNull
	@Schema(name = "(페이지네이션용) 마지막 거래 id")
	private Long lastDealId;

	@NotNull
	@Schema(name = "거래 종류, All/Auction/AuctionGame/Sharing/Trade")
	private String dealTypeName;
}
