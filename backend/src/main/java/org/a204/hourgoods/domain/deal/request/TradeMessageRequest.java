package org.a204.hourgoods.domain.deal.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "(1:1 거래) 실시간 위치 확인 시 위치 정보 전송")
public class TradeMessageRequest {
	@Schema(description = "실시간 위치 정보 id")
	private String tradeLocationId;

	@Schema(description = "사용자 닉네임")
	private String nickname;

	@Schema(description = "사용자 경도")
	private Double longitude;

	@Schema(description = "사용자 경도")
	private Double latitude;
}
