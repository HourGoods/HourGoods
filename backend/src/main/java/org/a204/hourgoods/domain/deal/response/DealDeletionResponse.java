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
@Schema(description = "거래 삭제 후 성공 여부 반환")
public class DealDeletionResponse {
	@Schema(description = "거래 삭제 성공 여부")
	private Boolean isSuccess;
}
