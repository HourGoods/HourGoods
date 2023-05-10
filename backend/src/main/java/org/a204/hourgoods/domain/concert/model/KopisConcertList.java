package org.a204.hourgoods.domain.concert.model;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@XmlRootElement(name = "dbs")
public class KopisConcertList {
	@XmlElement(name = "db")
	private List<ConcertInfo> concertInfoList;

	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	@Getter
	@ToString
	@XmlRootElement(name = "db")
	public static class ConcertInfo {
		@XmlElement(name = "mt20id")
		private String kopisConcertId; // 공연 id

		@XmlElement(name = "prfnm")
		private String title; // 공연 제목

		@XmlElement(name = "poster")
		private String imageUrl; // 공연 썸네일 이미지

		@XmlElement(name = "fcltynm")
		private String place; // 장소

		@XmlElement(name = "prfpdfrom")
		private String startDate;
	}
}
