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
@Schema(description = "거래 생성 후 거래 거래id 반환")
public class DealCreateResponse {
	@Schema(description = "생성된 거래id")
	private Long dealId;
}
