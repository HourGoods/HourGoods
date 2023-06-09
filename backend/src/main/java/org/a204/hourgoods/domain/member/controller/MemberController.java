package org.a204.hourgoods.domain.member.controller;

import javax.validation.Valid;

import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.domain.member.request.DuplicateNicknameRequest;
import org.a204.hourgoods.domain.member.request.MemberEditRequest;
import org.a204.hourgoods.domain.member.request.MemberSignupRequest;
import org.a204.hourgoods.domain.member.request.ReGenerateAccessTokenRequest;
import org.a204.hourgoods.domain.member.response.MemberSignUpResponse;
import org.a204.hourgoods.domain.member.response.ProfileEditResponse;
import org.a204.hourgoods.domain.member.response.ReGenerateAccessTokenResponse;
import org.a204.hourgoods.domain.member.service.MemberService;
import org.a204.hourgoods.global.common.BaseResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@Tag(name = "member", description = "Member API")
@RequiredArgsConstructor
public class MemberController {
	private final MemberService memberService;

	@PostMapping("/api/refresh")
	@Operation(description = "액세스 재발급 API", summary = "액세스 토큰 재발급 API")
	@ApiResponse(responseCode = "200", description = "재발급 성공", content = @Content(schema = @Schema(implementation = ReGenerateAccessTokenResponse.class)))
	public BaseResponse<ReGenerateAccessTokenResponse> reGenerateAccessToken(
		@Valid @RequestBody ReGenerateAccessTokenRequest request) {

		String regenerateAccessToken = memberService.regenerateAccessToken(request.getRefreshToken());
		return new BaseResponse<>(new ReGenerateAccessTokenResponse(regenerateAccessToken));
	}

	@ApiResponse(responseCode = "200", description = "회원가입 성공", content = @Content(schema = @Schema(implementation = MemberSignUpResponse.class)))
	@Operation(description = "회원 가입 API", summary = "회원가입 API")
	@PostMapping("/api/member/signup")
	public BaseResponse<MemberSignUpResponse> signup(@Valid @RequestBody MemberSignupRequest request) {
		MemberSignUpResponse signup = memberService.signup(request);
		return new BaseResponse<>(signup);
	}

	@PostMapping("/api/duplicateNickname")
	@Operation(description = "닉네임 중복 확인 API", summary = "닉네임 중복확인 API")
	@ApiResponse(responseCode = "200", description = "닉네임 중복 검사 통과", content = @Content(schema = @Schema(implementation = Boolean.class)))
	@ApiResponse(responseCode = "400", description = "닉네임 중복 검사 실패")
	public BaseResponse<Object> duplicateNickname(@Valid @RequestBody DuplicateNicknameRequest request) {
		Boolean isDuplicate = memberService.duplicateNickname(request.getNickname());
		return new BaseResponse<>(isDuplicate);
	}

	@PutMapping("/api/member/profile")
	@Operation(description = "사진과 닉네임 프로필 수정 API", summary = "프로필 수정 API")
	@ApiResponse(responseCode = "200", description = "프로필 수정 성공", content = @Content(schema = @Schema(implementation = ProfileEditResponse.class)))
	@ApiResponse(responseCode = "400", description = "1. M300 사용자를 찾을 수 없습니다.")
	public BaseResponse<ProfileEditResponse> profileEdit(@AuthenticationPrincipal MemberDetails memberDetails, @Valid @RequestBody MemberEditRequest request) {
		Member member = memberDetails.getMember();
		ProfileEditResponse response = memberService.editProfile(member, request);
		return new BaseResponse<>(response);
	}

	@PostMapping("/api/test")
	@Operation(description = "테스트용 JWT 토큰 발급 API", summary = "임시 JWT 발급")
	@ApiResponse(responseCode = "200", description = "JWT 토큰 발급")
	public BaseResponse<String> generateTemporaryJWT() {
		String tempToken = memberService.testToken();
		return new BaseResponse<>(tempToken);
	}
}