package org.a204.hourgoods.domain.member.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(name = "마이페이지 사용자 정보 응답")
public class MyPageMemberInfoResponse {
	@Schema(description = "사용자 닉네임")
	private String nickname;

	@Schema(description = "사용자 프로필 이미지 링크")
	private String imageUrl;

	@Schema(description = "사용자 포인트")
	private Integer cashPoint;
}
