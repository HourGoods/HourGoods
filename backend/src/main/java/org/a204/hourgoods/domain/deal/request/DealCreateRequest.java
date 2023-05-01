package org.a204.hourgoods.domain.deal.request;

import java.time.LocalDateTime;

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
@Schema(description = "거래 생성 요청")
public class DealCreateRequest {
	@NotNull
	@Schema(description = "거래 물품 이미지 S3 url")
	private String imageUrl;
	@NotNull
	@Schema(description = "거래 제목")
	private String title;
	@NotNull
	@Schema(description = "거래 내용")
	private String content;
	@NotNull
	@Schema(description = "거래 시작 시간")
	private LocalDateTime startTime;
	@NotNull
	@Schema(description = "거래 위치 경도")
	private Double longitude;
	@NotNull
	@Schema(description = "거래 위치 위도")
	private Double latitude;
	@NotNull
	@Schema(description = "거래 주최자 아이디")
	private Long memberId;
	@NotNull
	@Schema(description = "거래가 속한 콘서트")
	private Long concertId;
	@NotNull
	@Schema(description = "거래 종류, All/Auction/AuctionGame/Sharing/Trade")
	private String dealType;

	// auction & hourAuction
	@Schema(description = "경매 시작 금액")
	private Integer minimumPrice;
	@Schema(description = "경매 종료 시간")
	private LocalDateTime endTime;
	@Schema(description = "경매 최종 낙찰가")
	private Integer finalPrice;

	// sharing
	@Schema(description = "나눔 최대 정원")
	private Integer limit;

	// trade
	@Schema(description = "거래 가격")
	private Integer price;
}
