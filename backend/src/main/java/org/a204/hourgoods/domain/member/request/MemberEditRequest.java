package org.a204.hourgoods.domain.member.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "프로필 수정 API 요청")
@Getter
public class MemberEditRequest {
	@NotBlank(message = "닉네임은 필수입니다.")
	@Pattern(regexp = "^\\S*$", message = "닉네임에 공백이 있으면 안됩니다.")
	@Pattern(regexp = "^[A-Za-z0-9가-힣]{2,16}$", message = "닉네임은 2글자 이상 16자 이하입니다.")
	@Schema(description = "닉네임")
	private String nickname;
	@NotBlank(message = "이미지 경로는 필수입니다.")
	@Schema(description = "이미지 S3 경로")
	private String imageUrl;
}
