package org.a204.hourgoods.domain.deal.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.a204.hourgoods.domain.chatting.entity.ChattingRoom;
import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.participant.entity.Participant;
import org.a204.hourgoods.domain.transaction.entity.Transaction;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@RequiredArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Entity
@Table(name = "deal")
public class Deal {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "image_url", length = 150)
	private String imageUrl;

	@Column(name = "title", length = 100)
	private String title;

	@Column(name = "content")
	private String content;

	@Column(name = "start_time")
	private LocalDateTime startTime;

	@Column(name = "is_available")
	@ColumnDefault("true")
	private Boolean isAvailable ;

	@Enumerated(EnumType.STRING)
	@Column(name = "deal_type")
	private DealType dealType;

	@Column(name = "longitude")
	private Double longitude;

	@Column(name = "latitude")
	private Double latitude;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deal_host_id")
	private Member dealHost;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "concert_id")
	private Concert concert;

	@OneToMany(mappedBy = "deal", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<DealBookmark> dealBookmarks = new ArrayList<>();

	@OneToMany(mappedBy = "deal", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<ChattingRoom> chattingRooms = new ArrayList<>();

	@OneToMany(mappedBy = "deal", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<Participant> participants = new ArrayList<>();

	@OneToMany(mappedBy = "deal", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<Transaction> transactions = new ArrayList<>();

	@Builder
	public Deal(String imageUrl, String title, String content, LocalDateTime startTime, Boolean isAvailable, Member dealHost,
		Concert concert, DealType dealType, Double longitude, Double latitude) {
		this.imageUrl = imageUrl;
		this.title = title;
		this.content = content;
		this.startTime = startTime;
		this.isAvailable = isAvailable;
		this.dealHost = dealHost;
		this.concert = concert;
		this.dealType = dealType;
		this.longitude = longitude;
		this.latitude = latitude;
	}

}