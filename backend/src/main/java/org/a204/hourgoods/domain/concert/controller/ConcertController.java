package org.a204.hourgoods.domain.concert.controller;

import javax.validation.Valid;

import org.a204.hourgoods.domain.concert.request.ConcertIdRequest;
import org.a204.hourgoods.domain.concert.request.TodayConcertRequest;
import org.a204.hourgoods.domain.concert.response.ConcertIdResponse;
import org.a204.hourgoods.domain.concert.response.ConcertInfoResponse;
import org.a204.hourgoods.domain.concert.response.ConcertListResponse;
import org.a204.hourgoods.domain.concert.response.TodayConcertListResponse;
import org.a204.hourgoods.domain.concert.service.ConcertService;
import org.a204.hourgoods.domain.concert.service.KopisService;
import org.a204.hourgoods.global.common.BaseResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
@RequestMapping("/api/concert")
@Tag(name = "Concert", description = "공연 정보 관리 API")
@Slf4j
public class ConcertController {
	private final ConcertService concertService;
	private final KopisService kopisService;

	@Operation(description = "kopisConcertId와 일치하는 공연의 id를 조회한다.(없으면 생성해서 반환)", summary = "공연 아이디 조회 API")
	@ApiResponse(responseCode = "201", description = "등록 성공", content = @Content(schema = @Schema(implementation = ConcertIdResponse.class)))
	@PostMapping()
	public BaseResponse<ConcertIdResponse> getConcertId(@RequestBody ConcertIdRequest concertIdRequest) {
		ConcertIdResponse response = concertService.getConcertId(concertIdRequest);
		return new BaseResponse<>(response);
	}

	@Operation(description = "공연 id와 일치하는 공연 상세 정보를 조회한다.", summary = "공연 상세 정보 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = ConcertInfoResponse.class)))
	@GetMapping()
	public BaseResponse<ConcertInfoResponse> getConcertDetail(@RequestParam(name = "concertId") Long concertId) {
		ConcertInfoResponse response = concertService.getConcertDetail(concertId);
		return new BaseResponse<>(response);
	}

	@Operation(description = "제목에 키워드를 포함하며 한 달 내로 예정된 공연 정보 리스트를 조회한다.", summary = "공연 정보 리스트 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = ConcertListResponse.class)))
	@GetMapping("/search")
	public BaseResponse<ConcertListResponse> getConcertList(@RequestParam(name = "keyword") String keyword) {
		ConcertListResponse response = kopisService.getConcertList(keyword);
		return new BaseResponse<>(response);
	}

	@Operation(description = "오늘 시작하는 사용자와 가까운 순으로 정렬된 공연의 정보 리스트를 조회한다.", summary = "오늘의 사용자 주변 공연 정보 목록 조회 API")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = TodayConcertListResponse.class)))
	@GetMapping("/today")
	public BaseResponse<TodayConcertListResponse> getTodayConcertList(@Valid TodayConcertRequest todayConcertRequest) {
		TodayConcertListResponse response = concertService.getTodayConcertList(todayConcertRequest);
		return new BaseResponse<>(response);
	}

}
