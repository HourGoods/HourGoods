package org.a204.hourgoods.domain.concert.entity;

import java.time.LocalDateTime;
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

import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.global.common.BaseTime;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@ToString
@Table(name = "concert")
public class Concert extends BaseTime {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "title", length = 100)
	private String title;

	@Column(name = "image_url")
	private String imageUrl;

	@Column(name = "place")
	private String place;

	@Column(name = "longitude")
	private Double longitude;

	@Column(name = "latitude")
	private Double latitude;

	@Column(name = "start_time")
	private LocalDateTime startTime;

	@Column(name = "bookmark_count")
	private Integer bookmarkCount;

	@Column(name = "kopis_concert_id")
	private String kopisConcertId;

	@OneToMany(mappedBy = "concert", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<Deal> deals = new ArrayList<>();

	@OneToMany(mappedBy = "concert", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<ConcertBookmark> concertBookmarks = new ArrayList<>();

	@Builder
	public Concert(String title, String imageUrl, String place, Double latitude, Double longitude,
		LocalDateTime startTime, Integer bookmarkCount, String kopisConcertId) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.place = place;
		this.longitude = longitude;
		this.latitude = latitude;
		this.startTime = startTime;
		this.bookmarkCount = bookmarkCount;
		this.kopisConcertId = kopisConcertId;
	}
}
