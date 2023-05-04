package org.a204.hourgoods.domain.concert.response;

import java.util.List;

import org.a204.hourgoods.domain.concert.model.KopisConcertList;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "오늘의 사용자 주변 공연 리스트 정보 응답")
public class TodayConcertListResponse {
	@Schema(description = "다음 정보가 있는지 여부")
	private Boolean hasNextPage;

	@Schema(description = "현재 페이지의 마지막 공연 id")
	private Long lastConcertId;

	@Schema(description = "공연 상세 정보 리스트")
	private List<ConcertInfoResponse> concertInfoList;
}