package org.a204.hourgoods.domain.concert.model;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@XmlRootElement(name = "dbs")
public class KopisConcertDetail {
	@XmlElement(name = "db")
	private List<Info> info;

	@Getter
	@ToString
	@XmlRootElement(name = "db")
	public static class Info {
		@XmlElement(name = "prfnm")
		private String title;

		@XmlElement(name = "poster")
		private String imageUrl;

		@XmlElement(name = "fcltynm")
		private String place;

		@XmlElement(name = "mt10id")
		private String kopisPlaceId;

		@XmlElement(name = "prfpdfrom")
		private String startDate;

		@XmlElement(name = "dtguidance")
		private String timeInfo;
	}
}
