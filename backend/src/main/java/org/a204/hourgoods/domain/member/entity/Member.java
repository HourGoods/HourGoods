package org.a204.hourgoods.domain.member.entity;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.a204.hourgoods.domain.chatting.entity.DirectChattingRoom;
import org.a204.hourgoods.domain.concert.entity.ConcertBookmark;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.DealBookmark;
import org.a204.hourgoods.domain.participant.entity.Participant;
import org.a204.hourgoods.domain.report.entity.Report;
import org.a204.hourgoods.domain.transaction.entity.Transaction;
import org.hibernate.annotations.ColumnDefault;

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
	@ColumnDefault("'https://a204-hourgoods-bucket.s3.ap-northeast-2.amazonaws.com/image/member-profile/Union.svg'")
	private String imageUrl;

	@Column(name = "cash_point")
	@ColumnDefault("0")
	private Integer cashPoint;

	@Column(name = "status")
	@ColumnDefault("0")
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
	private List<PointHistory> pointHistories = new ArrayList<>();

	@OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<Participant> participants = new ArrayList<>();

	@OneToMany(mappedBy = "purchaser", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<Transaction> transactions = new ArrayList<>();

	@Builder
	public Member(Long id, String email, String nickname, String imageUrl) {
		this.id = id;
		this.email = email;
		this.nickname = nickname;
		this.imageUrl = imageUrl != null ? imageUrl : "'https://a204-hourgoods-bucket.s3.ap-northeast-2.amazonaws.com/image/member-profile/Union.svg'";
	}

	public void editMember(String nickname, String imageUrl) {
		this.nickname = nickname;
		this.imageUrl = imageUrl;
	}
}
