package org.a204.hourgoods.domain.concert.controller;

import org.a204.hourgoods.domain.concert.response.ConcertListResponse;
import org.a204.hourgoods.domain.concert.service.ConcertService;
import org.a204.hourgoods.domain.concert.service.KopisService;
import org.a204.hourgoods.global.common.BaseResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/concert/search")
@Tag(name = "Concert Search", description = "공연 검색 관련 API")
@Slf4j
public class ConcertController {
	private final ConcertService concertService;
	private final KopisService kopisService;

	@Operation(description = "사용자 주변 콘서트 정보 목록 조회 API", summary = "사용자 주변 콘서트 정보 목록 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = ConcertListResponse.class)))
	@GetMapping()
	public BaseResponse<ConcertListResponse> getConcertList(@RequestParam(name = "latitude") Double latitude,
		@RequestParam(name = "longitude") Double longitude, @RequestParam(name = "lastConcertId") Long lastConcertId) {
		ConcertListResponse response = concertService.getConcertList(latitude, longitude, lastConcertId);
		return new BaseResponse<>(response);
	}

	@Operation(description = "사용자 주변 콘서트 정보 목록 조회 API", summary = "사용자 주변 콘서트 정보 목록 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = ConcertListResponse.class)))
	@GetMapping("/registered")
	public BaseResponse<ConcertListResponse> getConcertListByKeyword(@RequestParam(name = "latitude") Double latitude,
		@RequestParam(name = "longitude") Double longitude,
		@RequestParam(name = "lastConcertId") Long lastConcertId,
		@RequestParam(name = "keyword") String keyword) {
		ConcertListResponse response = concertService.getConcertListByKeyword(latitude, longitude, lastConcertId,
			keyword);
		return new BaseResponse<>(response);
	}

	@Operation(description = "미등록 콘서트 정보 조회 API", summary = "미등록 콘서트 정보 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = ConcertListResponse.class)))
	@GetMapping("/unregistered")
	public BaseResponse<ConcertListResponse> getUnregisteredConcertListByKeyword(
		@RequestParam(name = "keyword") String keyword) {
		ConcertListResponse response = kopisService.getConcertList(keyword);
		return new BaseResponse<>(response);
	}

	@Operation(description = "콘서트 정보 등록 API", summary = "콘서트 정보 등록 API")
	@ApiResponse(responseCode = "201", description = "등록 성공", content = @Content(schema = @Schema(implementation = ConcertListResponse.class)))
	@PostMapping("/unregistered")
	public BaseResponse<Long> createConcert(
		@RequestParam(name = "kopisConcertId") String kopisConcertId) {
		Long response = concertService.createConcert(kopisConcertId);
		return new BaseResponse<>(response);
	}

}
