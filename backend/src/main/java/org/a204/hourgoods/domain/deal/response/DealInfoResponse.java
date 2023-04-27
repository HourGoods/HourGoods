package org.a204.hourgoods.domain.deal.response;

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
@Schema(description = "거래 간략한 정보 응답")
public class DealInfoResponse {

	@Schema(description = "거래 id")
	private Long dealId;

	@Schema(description = "거래 종류")
	private String dealTypeName;

	@Schema(description = "거래 물건 이미지 url")
	private String imageUrl;

	@Schema(description = "거래 제목")
	private String title;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm", timezone = "Asia/Seoul")
	@Schema(description = "거래 시작 시간")
	private LocalDateTime startTime;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm", timezone = "Asia/Seoul")
	@Schema(description = "(경매용) 거래 종료 시간")
	private LocalDateTime endTime;

	@Schema(description = "(나눔용) 제한 인원")
	private Integer limitation;

	@Schema(description = "(거래용) 가격")
	private Integer price;

}
