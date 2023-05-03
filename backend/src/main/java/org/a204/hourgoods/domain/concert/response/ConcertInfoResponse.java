package org.a204.hourgoods.domain.concert.response;

import java.time.LocalDateTime;

import org.a204.hourgoods.domain.concert.entity.Concert;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "공연 정보 응답")
public class ConcertInfoResponse {
	@Schema(description = "공연 id")
	private Long concertId;

	@Schema(description = "공연 제목")
	private String title;

	@Schema(description = "공연 썸네일 이미지")
	private String imageUrl;

	@Schema(description = "공연 경도")
	private Double longitude;

	@Schema(description = "공연 위도")
	private Double latitude;

	@Schema(description = "공연 장소")
	private String place;

	@Schema(description = "공연 시작 시간")
	private LocalDateTime startTime;

	@Schema(description = "공연 kopisConcertId")
	private String kopisConcertId;

	public ConcertInfoResponse(Concert concert) {
		this.concertId = concert.getId();
		this.title = concert.getTitle();
		this.imageUrl = concert.getImageUrl();
		this.longitude = concert.getLongitude();
		this.latitude = concert.getLatitude();
		this.place = concert.getPlace();
		this.startTime = concert.getStartTime();
		this.kopisConcertId = concert.getKopisConcertId();
	}
}
