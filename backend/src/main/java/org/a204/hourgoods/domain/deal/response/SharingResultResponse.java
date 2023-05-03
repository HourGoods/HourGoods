package org.a204.hourgoods.domain.deal.response;

import javax.validation.constraints.NotNull;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "무료 나눔 신청 결과 반환")
public class SharingResultResponse {
	@NotNull
	@Schema(description = "무료 나눔 선착순 순위 반환, -1인 경우 선착순 신청 실패")
	private Integer result;
}
