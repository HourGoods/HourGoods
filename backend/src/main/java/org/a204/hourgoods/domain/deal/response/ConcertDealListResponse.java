package org.a204.hourgoods.domain.deal.response;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "콘서트별 거래 리스트 정보 응답")
public class ConcertDealListResponse {

	@Schema(description = "다음 정보가 있는지 여부")
	private Boolean hasNextPage;

	@Schema(description = "현재 페이지의 마지막 거래 id")
	private Long lastDealId;

	@Schema(description = "거래 정보 리스트")
	private List<DealInfoResponse> dealInfoList;

}
