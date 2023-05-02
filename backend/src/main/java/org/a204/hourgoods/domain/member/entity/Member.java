package org.a204.hourgoods.domain.member.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.a204.hourgoods.domain.chatting.entity.ChattingLog;
import org.a204.hourgoods.domain.chatting.entity.DirectChattingRoom;
import org.a204.hourgoods.domain.concert.entity.ConcertBookmark;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.DealBookmark;
import org.a204.hourgoods.domain.participant.entity.Participant;
import org.a204.hourgoods.domain.report.entity.Report;
import org.a204.hourgoods.domain.transaction.entity.Transaction;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "member")
public class Member {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "email", length = 50)
	private String email;

	@Column(name = "nickname", length = 50)
	private String nickname;

	@Column(name = "image_url")
	private String imageUrl;

	@Column(name = "cash_point")
	private Integer cashPoint;

	@Column(name = "status")
	private Integer status;

    @OneToMany(mappedBy = "dealHost", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<Deal> deals = new ArrayList<>();

    // 신고한 목록
    @OneToMany(mappedBy = "reporterMember", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<Report> reportList = new ArrayList<>();

	// 신고 당한 목록
	@OneToMany(mappedBy = "reportedMember", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<Report> reportedList = new ArrayList<>();

	@OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<ConcertBookmark> concertBookmarks = new ArrayList<>();

	@OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<DealBookmark> dealBookmarks = new ArrayList<>();

	@OneToMany(mappedBy = "receiver", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<DirectChattingRoom> receiverChattingList = new ArrayList<>();

	@OneToMany(mappedBy = "sender", orphanRemoval = true)
	private List<DirectChattingRoom> senderChattingList = new ArrayList<>();

	@OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<ChattingLog> chattingLogs = new ArrayList<>();

	@OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<PointHistory> pointHistories = new ArrayList<>();

	@OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<Participant> participants = new ArrayList<>();

	@OneToMany(mappedBy = "purchaser", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<Transaction> transactions = new ArrayList<>();
	@Enumerated(EnumType.STRING)
	@Column(name = "registration_id")
	private RegistrationId registrationId;

	@Builder
	public Member(Long id, String email, String nickname, RegistrationId registrationId) {
		this.id = id;
		this.email = email;
		this.nickname = nickname;
		this.registrationId = registrationId;
	}

	public Member(String email, String nickname, RegistrationId registrationId) {
		this.email = email;
		this.nickname = nickname;
		this.registrationId = registrationId;
	}

	public enum RegistrationId {
		kakao, google

	}

}
