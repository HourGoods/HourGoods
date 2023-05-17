package org.a204.hourgoods.domain.concert.controller;

import java.time.LocalDate;
import java.util.List;

import javax.validation.Valid;

import org.a204.hourgoods.domain.concert.request.ConcertIdRequest;
import org.a204.hourgoods.domain.concert.request.TodayConcertRequest;
import org.a204.hourgoods.domain.concert.response.ConcertIdResponse;
import org.a204.hourgoods.domain.concert.response.ConcertInfoResponse;
import org.a204.hourgoods.domain.concert.response.ConcertListResponse;
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

	@Operation(summary = "공연 상세 정보 조회 API", description = "공연 id와 일치하는 공연 상세 정보를 조회한다.")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = ConcertInfoResponse.class)))
	@GetMapping()
	public BaseResponse<ConcertInfoResponse> getConcertDetail(@RequestParam(name = "concertId") Long concertId) {
		ConcertInfoResponse response = concertService.getConcertDetail(concertId);
		return new BaseResponse<>(response);
	}

	@Operation(summary = "공연 정보 검색 API", description = "한 달 내에 열리는 공연들 중 키워드를를 제목에 포함한 공연을 검색한다.")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = ConcertListResponse.class)))
	@GetMapping("/search")
	public BaseResponse<ConcertListResponse> getConcertListByKeyword(@RequestParam(name = "keyword") String keyword) {
		ConcertListResponse response = concertService.getConcertListByKeyword(keyword);
		return new BaseResponse<>(response);
	}

	@Operation(summary = "오늘의 공연 목록 조회 API", description = "오늘 열리는 공연들을 사용자와 가까운 순서로 반환한다.")
	@ApiResponse(responseCode = "200", description = "조회 성공", content = @Content(schema = @Schema(implementation = ConcertListResponse.class)))
	@GetMapping("/today")
	public BaseResponse<ConcertListResponse> getTodayConcertList(@Valid TodayConcertRequest todayConcertRequest) {
		ConcertListResponse response = concertService.getTodayConcertList(todayConcertRequest);
		return new BaseResponse<>(response);
	}

	@Operation(summary = "앞으로 한 달 내의 공연 정보 갱신 API", description = "오늘로부터 한 달 내의 공연 정보 리스트를 갱신한다.")
	@ApiResponse(responseCode = "200", description = "갱신 성공", content = @Content(schema = @Schema(implementation = List.class)))
	@PostMapping("/update")
	public BaseResponse<List<ConcertIdResponse>> updateConcertList(@RequestParam(name = "maxSize") Integer maxSize) {
		List<ConcertIdResponse> response = kopisService.getConcertByPeriod(maxSize);
		return new BaseResponse<>(response);
	}

}
