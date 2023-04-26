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

	@Operation(description = "콘서트별 거래 전체 목록 조회 API", summary = "콘서트별 거래 전체 목록 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = ConcertDealListResponse.class)))
	@GetMapping("/list")
	public BaseResponse<ConcertDealListResponse> getAllDealListByConcert(@Valid ConcertDealListRequest request) {
		ConcertDealListResponse response = dealService.getAllDealListByConcert(request);
		return new BaseResponse<>(response);
	}

}
