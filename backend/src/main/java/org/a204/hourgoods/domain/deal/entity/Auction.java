package org.a204.hourgoods.domain.deal.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;

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

	@Builder(builderMethodName = "auctionBuilder")
	public Auction(String imageUrl, String title, String content, LocalDateTime startTime, Boolean isAvaliable,
		Member dealHost, Concert concert, DealType dealType, Double longitude, Double latitude, Integer minimumPrice, Integer finalPrice,
		LocalDateTime endTime, String meetingLocation) {
		super(imageUrl, title, content, startTime, isAvaliable, dealHost, concert, dealType, longitude, latitude, meetingLocation);
		this.minimumPrice = minimumPrice;
		this.finalPrice = finalPrice;
		this.endTime = endTime;
	}

}
