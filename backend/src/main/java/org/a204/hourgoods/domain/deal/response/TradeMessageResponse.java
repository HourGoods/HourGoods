package org.a204.hourgoods.domain.deal.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "실시간 위치 정보 응답")
public class TradeMessageResponse {
	@Schema(description = "실시간 위치 정보 id")
	private String tradeLocationId;

	@Schema(description = "연관 거래 id")
	private Long dealId;

	@Schema(description = "판매자 닉네임")
	private String sellerNickname;

	@Schema(description = "구매자 닉네임")
	private String purchaserNickname;

	@Schema(description = "판매자의 위치 정보")
	private LocationInfoResponse sellerLocationInfo;

	@Schema(description = "구매자의 위치 정보")
	private LocationInfoResponse purchaserLocationInfo;
}
