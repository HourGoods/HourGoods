package org.a204.hourgoods.domain.deal.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "실시간 위치 확인 요청 응답")
public class CreateTradeLocationResponse {
	@Schema(description = "실시간 위치 정보 id")
	private String tradeLocationId;
}
