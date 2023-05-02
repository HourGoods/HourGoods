package org.a204.hourgoods.domain.deal.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "거래 상세 정보 응답")
public class DealDetailResponse {
	@Schema(description = "거래 제목")
	private String dealTitle;
	@Schema(description = "거래 물건 이미지 url")
	private String dealImageUrl;
	@Schema(description = "거래 상세 내용")
	private String dealContent;
	@Schema(description = "거래 위치 경도")
	private Double dealLongitude;
	@Schema(description = "거래 위치 위도")
	private Double dealLatitude;
	@Schema(description = "거래 종류, Auction/HourAuction/Sharing/Trade")
	private String dealType;
	@Schema(description = "판매자 프로필 이미지 url")
	private String userImageUrl;
	@Schema(description = "판매자 닉네임")
	private String userNickname;
	@Schema(description = "거래 시작 시간")
	private LocalDateTime startTime;
	@Schema(description = "콘서트 이름")
	private String concertTitle;
	@Schema(description = "북마크 여부")
	private Boolean isBookmarked;

	@Schema(description = "(경매용) 경매 시작가")
	private Integer minPrice;
	@Schema(description = "(경매용) 경매 종료 시간 ")
	private LocalDateTime endTime;

	@Schema(description = "(거래용) 가격")
	private Integer price;

	@Schema(description = "(나눔) 제한 인원")
	private Integer limit;

}
