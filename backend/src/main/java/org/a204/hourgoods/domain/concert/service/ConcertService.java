package org.a204.hourgoods.domain.concert.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
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
		// 1차 성능 개선
		LocalDateTime startTime = LocalDate.now().atStartOfDay();
		LocalDateTime endTime = LocalDate.now().plusDays(1).atStartOfDay().minusSeconds(1);
		List<Concert> concertList = concertQueryDslRepository.searchAllConcertByPeriod(startTime, endTime);
		// 사용자와의 거리를 key, 공연 정보를 value로 하는 오름차순 treeMap 생성
		Map<Double, Concert> treeMap = new TreeMap<>(new Comparator<Double>() {
			@Override
			public int compare(Double o1, Double o2) {
				if (o1 > o2) {
					return 1;
				}
				return -1;
			}
		});
		for (Concert concert : concertList) {
			Double distance = CheckDistanceUtil.getDistance(concert.getLatitude(), concert.getLongitude(),
				request.getLatitude(), request.getLongitude());
			treeMap.put(distance, concert);
		}
		// API 응답 형태로 변환 후 반환
		List<ConcertInfoResponse> concertInfoResponses = treeMap.values()
			.stream()
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
		// 2차 성능 개선
		List<Concert> concertList = concertQueryDslRepository.searchAllConcertByPeriodAndKeyword(
			LocalDate.now().atStartOfDay(), LocalDate.now().plusMonths(1).atStartOfDay().minusSeconds(1), keyword);
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
