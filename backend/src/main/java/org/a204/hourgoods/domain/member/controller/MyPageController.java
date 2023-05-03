package org.a204.hourgoods.domain.member.controller;

import org.a204.hourgoods.domain.deal.response.DealListResponse;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.domain.member.response.PointHistoryListResponse;
import org.a204.hourgoods.domain.member.service.MyPageService;
import org.a204.hourgoods.global.common.BaseResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
	public BaseResponse<DealListResponse> getBookmarkedDealList(
		@AuthenticationPrincipal MemberDetails memberDetails,
		@RequestParam(name = "lastDealId") Long lastDealId) {
		DealListResponse response = myPageService.getBookmarkedDealList(memberDetails, lastDealId);
		return new BaseResponse<>(response);
	}

	// 사용자가 생성한 거래 목록 조회
	@Operation(description = "요청을 보낸 사용자가 생성한 거래 목록 리스트를 조회한다.", summary = "사용자가 생성한 거래 목록 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = DealListResponse.class)))
	@GetMapping("/create")
	public BaseResponse<DealListResponse> getCreatedDealList(
		@AuthenticationPrincipal MemberDetails memberDetails,
		@RequestParam(name = "lastDealId") Long lastDealId) {
		DealListResponse response = myPageService.getCreatedDealList(memberDetails, lastDealId);
		return new BaseResponse<>(response);
	}

	// 사용자가 참여한 거래 목록 조회
	@Operation(description = "요청을 보낸 사용자가 참여한 거래 목록 리스트를 조회한다.", summary = "사용자가 참여한 거래 목록 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = DealListResponse.class)))
	@GetMapping("/attend")
	public BaseResponse<DealListResponse> getAttendedDealList(
		@AuthenticationPrincipal MemberDetails memberDetails,
		@RequestParam(name = "lastDealId") Long lastDealId) {
		DealListResponse response = myPageService.getAttendedDealList(memberDetails, lastDealId);
		return new BaseResponse<>(response);
	}

	// 사용자의 포인트 내역 조회
	@Operation(description = "요청을 보낸 사용자의 포인트 내역 리스트를 조회한다.", summary = "사용자의 포인트 내역 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = PointHistoryListResponse.class)))
	@GetMapping("/point")
	public BaseResponse<PointHistoryListResponse> getPointHistoryList(
		@AuthenticationPrincipal MemberDetails memberDetails,
		@RequestParam(name = "lastPointHistoryId") Long lastPointHistoryId) {
		PointHistoryListResponse response = myPageService.getPointHistoryList(memberDetails, lastPointHistoryId);
		return new BaseResponse<>(response);
	}

}
