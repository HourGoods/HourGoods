package org.a204.hourgoods.domain.concert.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.concert.model.KopisConcertDetail;
import org.a204.hourgoods.domain.concert.model.KopisPlaceDetail;
import org.a204.hourgoods.domain.concert.repository.ConcertRepository;
import org.a204.hourgoods.domain.concert.response.ConcertInfoResponse;
import org.a204.hourgoods.domain.concert.response.ConcertListResponse;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConcertService {
	private final ConcertRepository concertRepository;
	private final KopisService kopisService;

	private LocalDateTime parseLocalDateTime(String startDate, String timeInfo) {
		// startDate: { yyyy.MM.dd }
		// timeInfo: { ?요일(HH:mm) }
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd(HH:mm)");
		String str = startDate + timeInfo.substring(3, 10);
		LocalDateTime ldt = LocalDateTime.parse(str, formatter);
		return ldt;
	}

	// 공연 정보 등록
	public Long createConcert(String kopisConcertId) {
		KopisConcertDetail.Info concertDetail = kopisService.getConcertDetail(kopisConcertId);
		KopisPlaceDetail.Info placeDetail = kopisService.getPlaceDetail(concertDetail.getKopisPlaceId());
		Concert concert = Concert.builder()
			.title(concertDetail.getTitle())
			.imageUrl(concertDetail.getImageUrl())
			.place(concertDetail.getPlace())
			.startTime(parseLocalDateTime(concertDetail.getStartDate(), concertDetail.getTimeInfo()))
			.longitude(Double.parseDouble(placeDetail.getLongitude()))
			.latitude(Double.parseDouble(placeDetail.getLatitude()))
			.bookmarkCount(0)
			.build();
		return concertRepository.save(concert).getId();
	}

	// 사용자 주변 콘서트 정보 조회
	// parameter : 경도(longitude), 위도(latitude)
	public ConcertListResponse getConcertList(Double longitude, Double latitude, Long lastConcertId) {
		List<Concert> concertList = concertRepository.findAll();
		if (concertList.isEmpty()) {
			return ConcertListResponse.builder()
				.hasNextPage(false)
				.lastConcertId(lastConcertId)
				.build();
		}
		final List<ConcertInfoResponse> concertInfoResponseList = concertList.stream()
			.map(ConcertInfoResponse::new)
			.collect(Collectors.toList());
		final ConcertListResponse concertListResponse = ConcertListResponse.builder()
			.hasNextPage(false)
			.lastConcertId(concertInfoResponseList.get(concertInfoResponseList.size() - 1).getConcertId())
			.concertInfoList(concertInfoResponseList)
			.build();
		return concertListResponse;
	}

	// 제목에 키워드가 포함된 콘서트 정보 조회
	// parameter : 위도, 경도, 키워드
	public ConcertListResponse getConcertListByKeyword(Double longitude, Double latitude, Long lastConcertId,
		String keyword) {
		List<Concert> concertList = concertRepository.findAllByTitleContaining(keyword);
		if (concertList.isEmpty()) {
			return ConcertListResponse.builder()
				.hasNextPage(false)
				.lastConcertId(lastConcertId)
				.build();
		}
		final List<ConcertInfoResponse> concertInfoResponseList = concertList.stream()
			.map(ConcertInfoResponse::new)
			.collect(Collectors.toList());
		final ConcertListResponse concertListResponse = ConcertListResponse.builder()
			.hasNextPage(false)
			.lastConcertId(concertInfoResponseList.get(concertInfoResponseList.size() - 1).getConcertId())
			.concertInfoList(concertInfoResponseList)
			.build();
		return concertListResponse;
	}

}
