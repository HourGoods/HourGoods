package org.a204.hourgoods.domain.member.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(description = "가입 요청 응답")
public class MemberSignUpResponse {

	@Schema(description = "멤버 Id")
	private Long id;

	@Schema(description = "이메일")
	private String email;

	@Schema(description = "프로필 이미지 경로")
	private String imageUrl;
	@Schema(description = "닉네임")
	private String nickname;

	@Schema(description = "액세스 토큰")
	private String accessToken;
	@Schema(description = "리프레시 토큰")
	private String refreshToken;

}