package org.a204.hourgoods.domain.deal.request;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Schema(description = "콘서트별 거래 목록 조회 요청")
public class ConcertDealListRequest {

	@NotNull
	@Positive
	@Schema(description = "해당하는 콘서트 id")
	private Long concertId;

	@NotNull
	@Schema(description = "(페이지네이션용) 마지막 거래 id")
	private Long lastDealId;

	@NotEmpty
	@Schema(description = "거래 종류, All/Auction/AuctionGame/Sharing/Trade")
	private String dealTypeName;

	@Schema(description = "검색어, null일 경우 전체 목록 조회함.")
	private String searchKeyword;
}
