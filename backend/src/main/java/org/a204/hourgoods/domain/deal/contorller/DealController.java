package org.a204.hourgoods.domain.deal.contorller;

import javax.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.a204.hourgoods.domain.deal.request.ConcertDealListRequest;
import org.a204.hourgoods.domain.deal.response.ConcertDealListResponse;
import org.a204.hourgoods.domain.deal.service.DealService;
import org.a204.hourgoods.global.common.BaseResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/deal")
@Tag(name = "Deal", description = "거래하기 관련 API")
@Slf4j
public class DealController {

	private final DealService dealService;

	/**
	 * 콘서트id에 해당하는 거래 가능 목록 조회(Deal Type으로 거래 목록 필터링 가능)
	 * @param request concertId, lastDealId, dealTypeName
	 * @return dealTypeName에 따라 거래 가능한 전체 목록 반환
	 */
	@Operation(summary = "콘서트별/거래별/키워드별 거래 가능 목록 조회 API", description = "콘서트/거래별/키워드별 거래 가능 목록 조회. All로 넘기면 전체 목록 반환. 검색어 미반환시 전체 검색")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = ConcertDealListResponse.class)))
	@ApiResponse(responseCode = "404", description = "1. C100 해당하는 콘서트 찾을 수 없음 \t\n 2. D100 거래 타입이 잘못되었음")
	@GetMapping("/list")
	public BaseResponse<ConcertDealListResponse> getDealListByConcert(@Valid ConcertDealListRequest request) {
		ConcertDealListResponse response = dealService.getDealListByConcert(request);
		return new BaseResponse<>(response);
	}

}
