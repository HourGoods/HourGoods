package org.a204.hourgoods.domain.deal.response;

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
@Schema(description = "거래자의 위치 정보")
public class LocationInfoResponse {
	@Schema(description = "닉네임")
	private String otherNickname;

	@Schema(description = "경도")
	private Double otherLongitude;

	@Schema(description = "위도")
	private Double otherLatitude;

	@Schema(description = "상대방과의 거리")
	private Double distance;
}
