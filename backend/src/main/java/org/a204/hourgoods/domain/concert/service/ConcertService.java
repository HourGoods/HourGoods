package org.a204.hourgoods.domain.concert.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.concert.exception.ConcertAlreadyExistsException;
import org.a204.hourgoods.domain.concert.exception.ConcertNotFoundException;
import org.a204.hourgoods.domain.concert.model.KopisConcertDetail;
import org.a204.hourgoods.domain.concert.model.KopisPlaceDetail;
import org.a204.hourgoods.domain.concert.repository.ConcertRepository;
import org.a204.hourgoods.domain.concert.request.ConcertIdRequest;
import org.a204.hourgoods.domain.concert.request.TodayConcertRequest;
import org.a204.hourgoods.domain.concert.response.ConcertIdResponse;
import org.a204.hourgoods.domain.concert.response.ConcertInfoResponse;
import org.a204.hourgoods.domain.concert.response.ConcertListResponse;
import org.a204.hourgoods.domain.concert.response.TodayConcertListResponse;
import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConcertService {
	private final ConcertRepository concertRepository;
	private final KopisService kopisService;

	// kopisConcertId와 일치하는 공연의 concertId 반환
	public ConcertIdResponse getConcertId(ConcertIdRequest concertIdRequest) {
		String kopisConcertId = concertIdRequest.getKopisConcertId();
		if (!concertRepository.existsByKopisConcertId(kopisConcertId)) {
			return createConcert(kopisConcertId);
		}
		Long concertId = concertRepository.findByKopisConcertId(kopisConcertId)
			.orElseThrow(ConcertNotFoundException::new)
			.getId();
		return new ConcertIdResponse(concertId);
	}

	// 오늘의 사용자 주변 공연 정보 리스트 조회
	public TodayConcertListResponse getTodayConcertList(TodayConcertRequest todayConcertRequest) {
		// 사용자 위치 기준 정렬 미구현
		List<Concert> concertList = concertRepository.findAll();
		if (concertList.isEmpty()) {
			return TodayConcertListResponse.builder()
				.hasNextPage(false)
				.lastConcertId(Long.valueOf(-1))
				.build();
		}
		final List<ConcertInfoResponse> concertInfoResponseList = concertList.stream()
			.map(ConcertInfoResponse::new)
			.collect(Collectors.toList());
		final TodayConcertListResponse todayConcertListResponse = TodayConcertListResponse.builder()
			.hasNextPage(false)
			.lastConcertId(concertInfoResponseList.get(concertInfoResponseList.size() - 1).getConcertId())
			.concertInfoList(concertInfoResponseList)
			.build();
		return todayConcertListResponse;
	}

	// concertId와 일치하는 공연 정보 반환
	public ConcertInfoResponse getConcertDetail(Long concertId) {
		Concert concert = concertRepository.findById(concertId).orElseThrow(ConcertNotFoundException::new);
		return new ConcertInfoResponse(concert);
	}

	// 외부 API의 공연 시간을 파싱하여 LocalDateTime으로 변환
	private LocalDateTime parseLocalDateTime(String startDate, String timeInfo) {
		// startDate: { yyyy.MM.dd }
		// timeInfo: { 화요일(20:00), 수요일~금요일(18:00, 22:00) }
		// 정규표현식 패턴 생성
		Pattern pattern = Pattern.compile("(?<=\\()\\d{2}:\\d{2}(?=\\))");
		Matcher matcher = pattern.matcher(timeInfo);
		String str = startDate + "/";
		str += matcher.find() ? matcher.group() : "18:00";
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd/HH:mm");
		LocalDateTime ldt = LocalDateTime.parse(str, formatter);
		return ldt;
	}

	// 공연 정보 등록
	private ConcertIdResponse createConcert(String kopisConcertId) {
		KopisConcertDetail.Info concertDetail = kopisService.getConcertDetail(kopisConcertId);
		KopisPlaceDetail.Info placeDetail = kopisService.getPlaceDetail(concertDetail.getKopisPlaceId());

		// 기등록된 공연 정보인지 검사
		if (concertRepository.existsByTitle(concertDetail.getTitle())) {
			throw new ConcertAlreadyExistsException();
		}

		Concert concert = Concert.builder()
			.title(concertDetail.getTitle())
			.imageUrl(concertDetail.getImageUrl())
			.place(concertDetail.getPlace())
			.startTime(parseLocalDateTime(concertDetail.getStartDate(), concertDetail.getTimeInfo()))
			.longitude(Double.parseDouble(placeDetail.getLongitude()))
			.latitude(Double.parseDouble(placeDetail.getLatitude()))
			.bookmarkCount(0)
			.kopisConcertId(kopisConcertId)
			.build();
		Long concertId = concertRepository.save(concert).getId();
		ConcertIdResponse response = new ConcertIdResponse(concertId);
		return response;
	}
}
