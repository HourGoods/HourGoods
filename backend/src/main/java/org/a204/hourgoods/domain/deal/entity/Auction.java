package org.a204.hourgoods.domain.deal.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import java.time.LocalDateTime;

import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.member.entity.Member;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Auction extends Deal {
	@Column(name = "minimum_price")
	private Integer minimumPrice;

	@Column(name = "final_price")
	private Integer finalPrice;

	@Column(name = "end_time")
	private LocalDateTime endTime;

	@Column(name = "bidder_count")
	private Integer bidderCount;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member winner;

	@Builder(builderMethodName = "auctionBuilder")
	public Auction(String imageUrl, String title, String content, LocalDateTime startTime,
		Member dealHost, Concert concert, DealType dealType, Double longitude, Double latitude, Integer minimumPrice, Integer finalPrice,
		LocalDateTime endTime, String meetingLocation) {
		super(imageUrl, title, content, startTime, dealHost, concert, dealType, longitude, latitude, meetingLocation);
		this.minimumPrice = minimumPrice;
		this.finalPrice = finalPrice;
		this.endTime = endTime;
	}

	public void updateResult(Integer finalPrice, Integer bidderCount) {
		this.finalPrice = finalPrice;
		this.bidderCount = bidderCount;
	}
}
