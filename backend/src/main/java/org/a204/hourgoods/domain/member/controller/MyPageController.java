package org.a204.hourgoods.domain.member.controller;

import javax.validation.Valid;

import org.a204.hourgoods.domain.deal.response.DealListResponse;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.domain.member.request.UpdateCashPointRequest;
import org.a204.hourgoods.domain.member.response.MyPageMemberInfoResponse;
import org.a204.hourgoods.domain.member.response.PointHistoryListResponse;
import org.a204.hourgoods.domain.member.service.MyPageService;
import org.a204.hourgoods.global.common.BaseResponse;
import org.a204.hourgoods.global.security.annotation.PreAuthorizeMember;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@Tag(name = "MyPage", description = "마이페이지 관련 API")
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class MyPageController {
	private final MyPageService myPageService;

	// 사용자가 북마크한 거래 목록 조회
	@Operation(description = "요청을 보낸 사용자가 북마크한 거래 목록 리스트를 조회한다.", summary = "사용자가 북마크한 거래 목록 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = DealListResponse.class)))
	@GetMapping("/bookmark")
	public BaseResponse<DealListResponse> getBookmarkedDealList(@AuthenticationPrincipal MemberDetails memberDetails) {
		DealListResponse response = myPageService.getBookmarkedDealList(memberDetails);
		return new BaseResponse<>(response);
	}

	// 사용자가 생성한 거래 목록 조회
	@Operation(description = "요청을 보낸 사용자가 생성한 거래 목록 리스트를 조회한다.", summary = "사용자가 생성한 거래 목록 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = DealListResponse.class)))
	@GetMapping("/create")
	public BaseResponse<DealListResponse> getCreatedDealList(@AuthenticationPrincipal MemberDetails memberDetails) {
		DealListResponse response = myPageService.getCreatedDealList(memberDetails);
		return new BaseResponse<>(response);
	}

	// 사용자가 참여한 거래 목록 조회
	@Operation(description = "요청을 보낸 사용자가 참여한 거래 목록 리스트를 조회한다.", summary = "사용자가 참여한 거래 목록 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = DealListResponse.class)))
	@PreAuthorizeMember
	@GetMapping("/attend")
	public BaseResponse<DealListResponse> getAttendedDealList(@AuthenticationPrincipal MemberDetails memberDetails) {
		DealListResponse response = myPageService.getAttendedDealList(memberDetails);
		return new BaseResponse<>(response);
	}

	// 사용자의 포인트 내역 조회
	@Operation(description = "요청을 보낸 사용자의 포인트 내역 리스트를 조회한다.", summary = "사용자의 포인트 내역 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = PointHistoryListResponse.class)))
	@GetMapping("/point")
	public BaseResponse<PointHistoryListResponse> getPointHistoryList(
		@AuthenticationPrincipal MemberDetails memberDetails) {
		PointHistoryListResponse response = myPageService.getPointHistoryList(memberDetails);
		return new BaseResponse<>(response);
	}

	// 사용자 포인트 충전
	@Operation(description = "요청을 보낸 사용자의 포인트를 충전한다.", summary = "사용자 포인트 충전 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = MyPageMemberInfoResponse.class)))
	@PostMapping("/point")
	public BaseResponse<MyPageMemberInfoResponse> updateMemberCashPointInfo(
		@AuthenticationPrincipal MemberDetails memberDetails,
		@Valid @RequestBody UpdateCashPointRequest request) {
		MyPageMemberInfoResponse response = myPageService.updateMemberCashPoint(memberDetails, request);
		return new BaseResponse<>(response);
	}

	// 마이페이지 사용자 정보 조회
	@Operation(description = "요청을 보낸 사용자의 마이페이지 정보를 조회한다.", summary = "마이페이지 사용자 정보 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = MyPageMemberInfoResponse.class)))
	@GetMapping
	public BaseResponse<MyPageMemberInfoResponse> getMyPageMemberInfo(
		@AuthenticationPrincipal MemberDetails memberDetails) {
		MyPageMemberInfoResponse response = myPageService.getMyPageMemberInfo(memberDetails);
		return new BaseResponse<>(response);
	}

}
