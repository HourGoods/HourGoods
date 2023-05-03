package org.a204.hourgoods.domain.member.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "사용자 포인트 내역 조회 응답")
public class PointHistoryInfoResponse {

	@Schema(description = "포인트 내역 id")
	private Long pointHistoryId;

	@Schema(description = "포인트 내역 상세 설명")
	private String description;

	@Schema(description = "포인트 내역 상세 금액")
	private Integer amount;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm", timezone = "Asia/Seoul")
	@Schema(description = "포인트 내역 생성 시간")
	private LocalDateTime usageTime;

}