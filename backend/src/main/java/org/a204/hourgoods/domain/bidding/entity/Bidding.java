package org.a204.hourgoods.domain.bidding.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.member.entity.Member;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "bidding")
public class Bidding {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "bid_amount")
	private Integer bidAmount;

	@Column(name = "is_winner")
	private Boolean isWinner;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "purchaser_id")
	private Member bidder;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deal_id")
	private Deal deal;

	@Builder
	public Bidding(Integer bidAmount, Boolean isWinner, Member member, Deal deal) {
		this.bidAmount = bidAmount;
		this.isWinner = isWinner;
		this.bidder = member;
		this.deal = deal;
	}
}
