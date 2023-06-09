package org.a204.hourgoods.domain.member.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

import org.a204.hourgoods.domain.member.entity.Member;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "멤버 회원가입 API 요청")
@Getter
public class MemberSignupRequest {

	@Email(message = "이메일을 필수 값입니다.")
	@Schema(description = "이메일")
	private String email;
	@NotBlank(message = "닉네임은 필수입니다.")
	@Pattern(regexp = "^\\S*$", message = "닉네임에 공백이 있으면 안됩니다.")
	@Pattern(regexp = "^[A-Za-z0-9가-힣]{2,16}$", message = "닉네임은 2글자 이상 16자 이하입니다.")
	@Schema(description = "닉네임")
	private String nickname;
	@Schema(description = "이미지 S3 경로")
	private String imageUrl;

	public Member toEntity() {
		return Member.builder()
			.nickname(this.nickname)
			.email(this.email)
			.imageUrl(this.imageUrl).build();
	}
}