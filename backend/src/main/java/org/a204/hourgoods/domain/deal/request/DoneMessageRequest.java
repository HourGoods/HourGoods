package org.a204.hourgoods.domain.deal.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Builder
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "거래 종료 요청")
public class DoneMessageRequest {
	@Schema(description = "실시간 위치 정보 id")
	private String tradeLocationId;

	@Schema(description = "사용자 닉네임")
	private String nickname;
}
