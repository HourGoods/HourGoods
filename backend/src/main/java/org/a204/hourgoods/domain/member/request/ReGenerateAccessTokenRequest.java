package org.a204.hourgoods.domain.member.request;

import javax.validation.constraints.NotBlank;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Schema(description = "Refresh토큰으로 Access 토큰을 재발급 받음")
public class ReGenerateAccessTokenRequest {

	@NotBlank
	@Schema(description = "액세스 토큰")
	private String accessToken;
	@NotBlank
	@Schema(description = "리프레시 토큰")
	private String refreshToken;

}