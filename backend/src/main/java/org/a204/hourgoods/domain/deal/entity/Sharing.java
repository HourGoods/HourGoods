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

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
public class Sharing extends Deal {
	@Column(name = "limitation")
	private Integer limitation;

	@Builder(builderMethodName = "sharingBuilder")
	public Sharing(String imageUrl, String title, String content, LocalDateTime startTime, Boolean isAvaliable,
		Member dealHost, Concert concert, DealType dealType,  Double longitude, Double latitude, Integer limitation) {
		super(imageUrl, title, content, startTime, isAvaliable, dealHost, concert, dealType, longitude, latitude);
		this.limitation = limitation;
	}
}