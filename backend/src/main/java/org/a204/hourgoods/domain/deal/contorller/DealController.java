package org.a204.hourgoods.domain.deal.contorller;

import javax.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.a204.hourgoods.domain.deal.exception.MemberMissMatchException;
import org.a204.hourgoods.domain.deal.request.BookmarkRequest;
import org.a204.hourgoods.domain.deal.request.ConcertDealListRequest;
import org.a204.hourgoods.domain.deal.request.DealCreateRequest;
import org.a204.hourgoods.domain.deal.response.BookmarkCheckResponse;
import org.a204.hourgoods.domain.deal.response.BookmarkResponse;
import org.a204.hourgoods.domain.deal.response.DealCreateResponse;
import org.a204.hourgoods.domain.deal.response.DealDeletionResponse;
import org.a204.hourgoods.domain.deal.response.DealDetailResponse;
import org.a204.hourgoods.domain.deal.response.DealListResponse;
import org.a204.hourgoods.domain.deal.service.BookmarkService;
import org.a204.hourgoods.domain.deal.service.DealService;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.global.common.BaseResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/deal")
@Tag(name = "Deal", description = "거래하기 관련 API")
@Slf4j
public class DealController {

	private final DealService dealService;
	private final BookmarkService bookmarkService;

	/**
	 * 콘서트id에 해당하는 거래 가능 목록 조회(Deal Type으로 거래 목록 필터링 가능)
	 * @param request concertId, lastDealId, dealTypeName
	 * @return dealTypeName에 따라 거래 가능한 전체 목록 반환
	 */
	@Operation(summary = "콘서트별/거래별/키워드별 거래 가능 목록 조회 API", description = "콘서트/거래별/키워드별 거래 가능 목록 조회. All로 넘기면 전체 목록 반환. 검색어 미반환시 전체 검색")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = DealListResponse.class)))
	@ApiResponse(responseCode = "400", description = "1. M300 해당 닉네임에 해당하는 사용자를 찾을 수 없음")
	@ApiResponse(responseCode = "404", description = "1. C100 해당하는 콘서트 찾을 수 없음 \t\n 2. D100 거래 타입이 잘못되었음")
	@GetMapping("/list")
	public BaseResponse<DealListResponse> getDealListByConcert(@Valid ConcertDealListRequest request) {
		DealListResponse response = dealService.getDealListByConcert(request);
		return new BaseResponse<>(response);
	}

	/**
	 * 거래id에 해당하는 거래 상세 조회
	 * @param dealId 조회할 거래id
	 * @return 해당 deal의 상세 내용 반환
	 */
	@Operation(summary = "거래 상세 API", description = "거래id에 해당하는 거래에 대한 상세 정보 조회")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = DealDetailResponse.class)))
	@ApiResponse(responseCode = "404", description = "1. D200 ID에 해당하는 거래 없음")
	@GetMapping("/detail")
	public BaseResponse<DealDetailResponse> getDealDetail(@AuthenticationPrincipal MemberDetails memberDetails,
		@RequestParam Long dealId) {
		Member member = memberDetails.getMember();
		DealDetailResponse response = dealService.getDealDetail(member, dealId);
		return new BaseResponse<>(response);
	}

	/**
	 * 거래 생성
	 * @param dealCreateRequest 거래 생성에 필요한 정보
	 * @return 생성된 거래 id 반환
	 */
	@Operation(summary = "거래 생성 API", description = "경매, 게임경매, 거래, 나눔 모두 하나의 API로 생성, 종류에 따라 필요한 request 다름")
	@ApiResponse(responseCode = "200", description = "생성 완료", content = @Content(schema = @Schema(implementation = DealCreateResponse.class)))
	@ApiResponse(responseCode = "400", description = "1. M300 해당 사용자ID 조회 실패")
	@ApiResponse(responseCode = "404", description = "1. C100 해당 콘서트ID 조회 실패")
	@PostMapping("/create")
	public BaseResponse<DealCreateResponse> createDeal(@AuthenticationPrincipal MemberDetails memberDetails, @RequestBody @Valid DealCreateRequest dealCreateRequest) {
		Member member = memberDetails.getMember();
		DealCreateResponse dealCreateResponse = dealService.createDeal(dealCreateRequest, member);
		return new BaseResponse<>(dealCreateResponse);
	}

	/**
	 * 거래 삭제 API
	 * @param memberDetails JWT 토큰을 이용하여 member 정보를 얻는다.
	 * @param dealId 삭제하고 싶은 deal id
	 * @return 거래 삭제 여부를 반환한다.
	 */
	@Operation(summary = "거래 삭제 API", description = "거래 삭제 API, 거래를 생성한 사람만 삭제가 가능, pathVariable로 거래ID 요청")
	@ApiResponse(responseCode = "200", description = "거래 삭제 완료", content = @Content(schema = @Schema(implementation = DealDeletionResponse.class)))
	@ApiResponse(responseCode = "400", description = "1. M400 요청 사용자와 생성 사용자 ID 불일치")
	@ApiResponse(responseCode = "404", description = "1. D200 해당 거래ID 조회 실패")
	@DeleteMapping("/{dealId}")
	public BaseResponse<DealDeletionResponse> deleteDeal(@AuthenticationPrincipal MemberDetails memberDetails, @PathVariable Long dealId) {
		Member member = memberDetails.getMember();
		DealDeletionResponse response = DealDeletionResponse.builder()
			.isSuccess(dealService.deleteDeal(member.getId(), dealId)).build();
		return new BaseResponse<>(response);
	}

	/**
	 * 북마크 등록 API
	 * @param memberDetails JWT 토큰을 이용하여 member 정보를 얻는다.
	 * @param bookmarkRequest {@link BookmarkRequest} deal 아이디를 요청
	 * @return 북마크 등록 성공 여부를 반환
	 */
	@Operation(summary = "북마크 등록 API", description = "북마크 등록 API, jwt 토큰의 사용자 이름으로 북마크 등록")
	@ApiResponse(responseCode = "200", description = "북마크 등록 완료", content = @Content(schema = @Schema(implementation = BookmarkResponse.class)))
	@ApiResponse(responseCode = "404", description = "1. D200 해당 거래ID 조회 실패")
	@PostMapping("/bookmark")
	public BaseResponse<BookmarkResponse> createBookmark(@AuthenticationPrincipal MemberDetails memberDetails, @RequestBody
		BookmarkRequest bookmarkRequest) {
		Member member = memberDetails.getMember();
		BookmarkResponse response = BookmarkResponse.builder()
			.isSuccess(bookmarkService.registBookmark(bookmarkRequest.getDealId(), member)).build();
		return new BaseResponse<>(response);
	}

	/**
	 * 북마크 해제 API
	 * @param memberDetails JWT 토큰을 이용하여 member 정보를 얻는다.
	 * @param bookmarkRequest {@link BookmarkRequest} deal 아이디를 요청
	 * @return 북마크 해제 성공 여부를 반환
	 */
	@Operation(summary = "북마크 해제 API", description = "북마크 해제 API, jwt 토큰의 사용자 이름으로 북마크 해제")
	@ApiResponse(responseCode = "200", description = "북마크 해제 완료", content = @Content(schema = @Schema(implementation = BookmarkResponse.class)))
	@ApiResponse(responseCode = "404", description = "1. D200 해당 거래ID 조회 실패 \t\n 2. D300 북마크 조회 실패")
	@DeleteMapping("/bookmark")
	public BaseResponse<BookmarkResponse> cancelBookmark(@AuthenticationPrincipal MemberDetails memberDetails, @RequestBody
	BookmarkRequest bookmarkRequest) {
		Member member = memberDetails.getMember();
		BookmarkResponse response = BookmarkResponse.builder()
			.isSuccess(bookmarkService.cancelBookmark(bookmarkRequest.getDealId(), member)).build();
		return new BaseResponse<>(response);
	}

	@Operation(summary = "북마크 확인 API", description = "북마크 확인 API, jwt 토큰의 사용자 이름으로 북마크 확인")
	@ApiResponse(responseCode = "200", description = "북마크 해제 완료", content = @Content(schema = @Schema(implementation = BookmarkCheckResponse.class)))
	@ApiResponse(responseCode = "404", description = "1. D200 해당 거래ID 조회 실패")
	@GetMapping("/bookmark")
	public BaseResponse<BookmarkCheckResponse> cancelBookmark(@AuthenticationPrincipal MemberDetails memberDetails, @RequestParam Long dealId) {
		Member member = memberDetails.getMember();
		BookmarkCheckResponse response = BookmarkCheckResponse.builder()
			.isBookmarked(bookmarkService.checkBookmark(member, dealId)).build();
		return new BaseResponse<>(response);
	}
}
