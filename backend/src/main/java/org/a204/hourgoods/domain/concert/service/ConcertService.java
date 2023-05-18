package org.a204.hourgoods.domain.concert.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.concert.exception.ConcertNotFoundException;
import org.a204.hourgoods.domain.concert.repository.ConcertQueryDslRepository;
import org.a204.hourgoods.domain.concert.repository.ConcertRepository;
import org.a204.hourgoods.domain.concert.request.TodayConcertRequest;
import org.a204.hourgoods.domain.concert.response.ConcertInfoResponse;
import org.a204.hourgoods.domain.concert.response.ConcertListResponse;
import org.a204.hourgoods.global.util.CheckDistanceUtil;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConcertService {
	private final ConcertRepository concertRepository;
	private final ConcertQueryDslRepository concertQueryDslRepository;

	// 오늘의 공연 목록 조회
	public ConcertListResponse getTodayConcertList(TodayConcertRequest request) {
		// 오늘 열리는 공연 리스트 조회
		// 0차
		LocalDateTime startTime = LocalDate.now().atStartOfDay();
		LocalDateTime endTime = LocalDate.now().plusDays(1).atStartOfDay().minusSeconds(1);
		List<Concert> concertList = concertRepository.findAllByStartTimeBetween(startTime, endTime);
		// 1차
		// List<Concert> concertList = concertQueryDslRepository.searchConcertByDate(LocalDate.now());

		// 사용자와 가까운 순으로 정렬
		concertList.sort(new Comparator<Concert>() {
			@Override
			public int compare(Concert c1, Concert c2) {
				double dist1 = CheckDistanceUtil.getDistance(c1.getLatitude(), c1.getLongitude(),
					request.getLatitude(), request.getLongitude());
				double dist2 = CheckDistanceUtil.getDistance(c2.getLatitude(), c2.getLongitude(),
					request.getLatitude(), request.getLongitude());
				if (dist1 - dist2 > 0) {
					return 1;
				}
				return -1;
			}
		});

		// API 응답 형태로 변환 후 반환
		List<ConcertInfoResponse> concertInfoResponses = concertList.stream()
			.map(ConcertInfoResponse::new)
			.collect(Collectors.toList());

		Long lastConcertId = concertInfoResponses.isEmpty() ? -1 :
			concertInfoResponses.get(concertInfoResponses.size() - 1).getConcertId();

		final ConcertListResponse responses = ConcertListResponse.builder()
			.hasNextPage(false)
			.lastConcertId(lastConcertId)
			.concertInfoList(concertInfoResponses)
			.build();
		return responses;
	}

	// concertId와 일치하는 공연 정보 반환
	public ConcertInfoResponse getConcertDetail(Long concertId) {
		Concert concert = concertRepository.findById(concertId).orElseThrow(ConcertNotFoundException::new);
		return new ConcertInfoResponse(concert);
	}

	// 키워드를 제목에 포함하는 공연 정보 검색
	public ConcertListResponse getConcertListByKeyword(String keyword) {
		// 0차
		LocalDateTime startTime = LocalDate.now().atStartOfDay();
		LocalDateTime endTime = LocalDate.now().plusDays(1).atStartOfDay().minusSeconds(1);
		List<Concert> concertList = concertRepository.findAllByStartTimeBetweenAndTitleContaining(startTime, endTime,
			keyword);
		// 1차
		// List<Concert> concertList = concertQueryDslRepository.searchAllConcertByPeriodAndKeyword(
		// 	LocalDate.now().atStartOfDay(), LocalDate.now().plusMonths(1).atStartOfDay().minusSeconds(1), keyword);
		List<ConcertInfoResponse> concertInfoResponses = concertList.stream()
			.map(ConcertInfoResponse::new)
			.collect(Collectors.toList());
		Long lastConcertId = Long.valueOf(-1);
		if (!concertList.isEmpty()) {
			lastConcertId = concertInfoResponses.get(concertInfoResponses.size() - 1).getConcertId();
		}
		return ConcertListResponse.builder()
			.hasNextPage(false)
			.lastConcertId(lastConcertId)
			.concertInfoList(concertInfoResponses)
			.build();
	}

}
