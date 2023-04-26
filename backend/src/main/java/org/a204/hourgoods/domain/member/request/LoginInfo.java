package org.a204.hourgoods.domain.member.request;

import javax.validation.constraints.NotNull;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Schema(description = "관리자 계정 API 요청")
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class LoginInfo {

	@NotNull
	@Schema(description = "관리자 계정 id")
	private String id;

	@NotNull
	@Schema(description = "관리자 계정 비밀번호")
	private String password;

}
