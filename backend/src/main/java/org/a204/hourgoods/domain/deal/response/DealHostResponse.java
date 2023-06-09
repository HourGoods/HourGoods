package org.a204.hourgoods.domain.deal.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "거래 host 정보 응답")
public class DealHostResponse {
	@Schema(description = "거래 host의 ID")
	private Long memberId;
	@Schema(description = "거래 host의 닉네임")
	private String nickname;
}
