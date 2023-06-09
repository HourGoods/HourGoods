package org.a204.hourgoods.domain.member.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
@Schema(description = "가입 요청 응답")
public class ProfileEditResponse {
	@Schema(description = "프로필 이미지 경로")
	private String imageUrl;
	@Schema(description = "닉네임")
	private String nickname;
}
