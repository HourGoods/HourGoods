package org.a204.hourgoods.domain.concert.model;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
@XmlRootElement(name = "dbs")
public class KopisPlaceDetail {
	@XmlElement(name = "db")
	private List<Info> info;

	@Getter
	@ToString
	@XmlRootElement(name = "db")
	public static class Info {
		@XmlElement(name = "fcltynm")
		private String name;

		@XmlElement(name = "la")
		private String latitude;

		@XmlElement(name = "lo")
		private String longitude;
	}
}
