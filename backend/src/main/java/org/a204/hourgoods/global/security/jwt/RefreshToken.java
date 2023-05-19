package org.a204.hourgoods.global.security.jwt;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.Getter;

@RedisHash(value = "refreshToken")
public class RefreshToken {

	@Getter
	@Id
	private final String refreshTokenKey;
	private final String accessTokenValue;

	public RefreshToken(final String refreshTokenKey, final String accessTokenValue) {
		this.refreshTokenKey = refreshTokenKey;
		this.accessTokenValue = accessTokenValue;
	}

	public String getAccessTokenValue() {
		return accessTokenValue;
	}
}