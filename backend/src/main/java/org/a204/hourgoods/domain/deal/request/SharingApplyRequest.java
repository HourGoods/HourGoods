package org.a204.hourgoods.domain.deal.request;

import javax.validation.constraints.NotNull;

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
@Schema(description = "무료 나눔 신청 요청")
public class SharingApplyRequest {
	@NotNull
	@Schema(description = "신청하는 거래 ID 반환")
	private Long dealId;
}
