package org.a204.hourgoods.domain.concert.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.global.common.BaseTime;
import org.locationtech.jts.geom.Point;

import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "concert")
public class Concert extends BaseTime {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "title", length = 100)
	private String title;

	@Column(name = "content")
	private String content;

	@Column(name = "image_url")
	private String imageUrl;

	@Column(name = "place")
	private String place;

	@Column(columnDefinition = "GEOMETRY")
	private Point location;

	@Column(name = "start_time")
	private LocalDateTime startTime;

	@Column(name = "bookmark_count")
	private Integer bookmarkCount;

	@OneToMany(mappedBy = "concert", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<Deal> deals = new ArrayList<>();

	@OneToMany(mappedBy = "concert", cascade = CascadeType.PERSIST, orphanRemoval = true)
	private List<ConcertBookmark> concertBookmarks = new ArrayList<>();

	@Builder
	public Concert(String title, String content, String imageUrl, String place, Point location, LocalDateTime startTime,
		Integer bookmarkCount) {
		this.title = title;
		this.content = content;
		this.imageUrl = imageUrl;
		this.place = place;
		this.location = location;
		this.startTime = startTime;
		this.bookmarkCount = bookmarkCount;
	}

}
