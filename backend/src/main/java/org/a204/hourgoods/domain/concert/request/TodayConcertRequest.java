package org.a204.hourgoods.domain.concert.request;

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
@Schema(description = "오늘의 사용자 주변 공연 리스트 조회 요청")
public class TodayConcertRequest {
	@NotNull
	@Schema(description = "현재 사용자 경도")
	private Double longitude;

	@NotNull
	@Schema(description = "현재 사용자 위도")
	private Double latitude;
}
