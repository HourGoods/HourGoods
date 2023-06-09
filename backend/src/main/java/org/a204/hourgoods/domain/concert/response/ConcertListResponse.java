package org.a204.hourgoods.domain.concert.response;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "외부 API로부터 조회한 공연 정보 리스트 응답")
public class ConcertListResponse {
	@Schema(description = "다음 정보가 있는지 여부")
	private Boolean hasNextPage;

	@Schema(description = "현재 페이지의 마지막 공연 id")
	private Long lastConcertId;

	@Schema(description = "공연 정보 리스트")
	private List<ConcertInfoResponse> concertInfoList;
}
