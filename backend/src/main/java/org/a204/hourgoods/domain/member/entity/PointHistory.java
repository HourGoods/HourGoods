package org.a204.hourgoods.domain.member.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "point_history")
public class PointHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "amount")
	private Integer amount;

	@Column(name = "description", length = 100)
	private String description;

	@Column(name = "usage_time")
	private LocalDateTime usageTime;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	@Builder
	public PointHistory(Integer amount, String description, LocalDateTime usageTime, Member member) {
		this.amount = amount;
		this.description = description;
		this.usageTime = usageTime;
		this.member = member;
	}
}