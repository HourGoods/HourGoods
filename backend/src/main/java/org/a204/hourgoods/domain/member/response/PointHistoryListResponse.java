package org.a204.hourgoods.domain.member.response;

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
@Schema(description = "사용자 포인트 내역 리스트 조회 응답")
public class PointHistoryListResponse {

	@Schema(description = "다음 정보가 있는지 여부")
	private Boolean hasNextPage;

	@Schema(description = "현재 페이지의 마지막 포인트 내역 id")
	private Long lastPointHistoryId;

	@Schema(description = "거래 정보 리스트")
	private List<PointHistoryInfoResponse> pointHistoryInfoList;

}
