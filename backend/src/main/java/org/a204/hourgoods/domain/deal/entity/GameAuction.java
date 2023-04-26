package org.a204.hourgoods.domain.deal.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import java.time.LocalDateTime;

import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.member.entity.Member;
import org.locationtech.jts.geom.Point;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class GameAuction extends Deal {
	@Column(name = "minimum_price")
	private Integer minimumPrice;

	@Column(name = "final_price")
	private Integer finalPrice;

	@Column(name = "end_time")
	private LocalDateTime endTime;

	@Builder(builderMethodName = "gameAuctionBuilder")
	public GameAuction(String imageUrl, String title, String content, LocalDateTime startTime, Boolean status,
		Member dealHost, Concert concert, DealType dealType, Point location, Integer minimumPrice, Integer finalPrice,
		LocalDateTime endTime) {
		super(imageUrl, title, content, startTime, status, dealHost, concert, dealType, location);
		this.minimumPrice = minimumPrice;
		this.finalPrice = finalPrice;
		this.endTime = endTime;
	}

}
