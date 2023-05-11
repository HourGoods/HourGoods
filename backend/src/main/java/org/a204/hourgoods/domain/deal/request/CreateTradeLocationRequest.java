package org.a204.hourgoods.domain.deal.request;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "실시간 위치 확인 요청")
public class CreateTradeLocationRequest {
	@NotNull
	@Schema(description = "관련 거래 id")
	private Long dealId;

	@NotEmpty
	@Schema(description = "판매자 닉네임")
	private String sellerNickname;

	@NotEmpty
	@Schema(description = "구매자 닉네임")
	private String purchaserNickname;
}
