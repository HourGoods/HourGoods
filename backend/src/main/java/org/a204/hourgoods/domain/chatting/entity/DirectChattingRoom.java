package org.a204.hourgoods.domain.chatting.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.global.common.BaseTime;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "chatting_room")
public class DirectChattingRoom extends BaseTime {
	@Id
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "last_log_content")
	private String lastLogContent;

	@Column(name = "last_log_time")
	private String lastLogTime;

	@Column(name = "last_log_id")
	private String lastLogId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "receiver_id")
	private Member receiver;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sender_id")
	private Member sender;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deal_id")
	private Deal deal;

	@PrePersist
	public void prePersist() {
		// 현재 시간의 나노초를 사용하여 ID 생성
		this.id = System.nanoTime();
	}

	@Builder
	public DirectChattingRoom(Member receiver, Member sender, Deal deal) {
		this.receiver = receiver;
		this.sender = sender;
		this.deal = deal;
	}

	public void updateLastLog(String lastLogContent, String lastLogTime, String lastLogId) {
		this.lastLogTime = lastLogTime;
		this.lastLogContent = lastLogContent;
		this.lastLogId = lastLogId;
	}

}