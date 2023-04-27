package org.a204.hourgoods.domain.deal.entity;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;

import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.member.entity.Member;
import org.locationtech.jts.geom.Point;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Trade extends Deal {
	@Column(name = "price")
	private Integer price;

	@Builder(builderMethodName = "tradeBuilder")
	public Trade(String imageUrl, String title, String content, LocalDateTime startTime, Boolean isAvaliable,
		Member dealHost, Concert concert, DealType dealType, Point location, Integer price) {
		super(imageUrl, title, content, startTime, isAvaliable, dealHost, concert, dealType, location);
		this.price = price;
	}
}
