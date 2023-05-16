package org.a204.hourgoods.domain.deal.entity;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
@RedisHash(value = "tradeRedis")
public class TradeLocation implements Serializable {
	private static final long serialVersionUID = -8304525817629560393L;

	@Id
	private final String id;

	@Indexed
	private final String dealId;

	@Indexed
	private String sellerId;

	@Indexed
	private String purchaserId;

	private String sellerLongitude;

	private String sellerLatitude;

	private String purchaserLongitude;

	private String purchaserLatitude;

	private String distance;

	public void updateSellerInfo(String longitude, String latitude) {
		this.sellerLongitude = longitude;
		this.sellerLatitude = latitude;
	}

	public void updatePurchaserInfo(String longitude, String latitude) {
		this.purchaserLongitude = longitude;
		this.purchaserLatitude = latitude;
	}

	public void updateDistance(String distance) {
		this.distance = distance;
	}
}
