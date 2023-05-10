package org.a204.hourgoods.domain.member.request;

import javax.validation.constraints.NotNull;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(description = "사용자 포인트 충전 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class UpdateCashPointRequest {
	@NotNull
	@Schema(description = "충전할 포인트")
	private Integer cashPoint;
}
