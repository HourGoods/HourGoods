package org.a204.hourgoods.domain.concert.service;

import java.io.StringReader;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.concert.exception.EmptyConcertDetailException;
import org.a204.hourgoods.domain.concert.model.KopisConcertDetail;
import org.a204.hourgoods.domain.concert.model.KopisConcertList;
import org.a204.hourgoods.domain.concert.model.KopisPlaceDetail;
import org.a204.hourgoods.domain.concert.repository.ConcertQueryDslRepository;
import org.a204.hourgoods.domain.concert.repository.ConcertRepository;
import org.a204.hourgoods.domain.concert.response.ConcertIdResponse;
import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class KopisService {

	private final String concertListRequestUrl = "http://www.kopis.or.kr/openApi/restful/pblprfr";
	private final String concertDetailRequestUrl = "http://www.kopis.or.kr/openApi/restful/pblprfr";
	private final String placeDetailRequestUrl = "http://www.kopis.or.kr/openApi/restful/prfplc";
	private final ConcertQueryDslRepository concertQueryDslRepository;
	private final ConcertRepository concertRepository;
	private final ConcertService concertService;

	@Value("${spring.kopis.api-key}")
	private String apiKey;

	public KopisService(
		ConcertQueryDslRepository concertQueryDslRepository,
		ConcertRepository concertRepository, ConcertService concertService) {
		this.concertQueryDslRepository = concertQueryDslRepository;
		this.concertRepository = concertRepository;
		this.concertService = concertService;
	}

	// kopis api에서 호출한 특정 기간 내의 새로운 공연 정보 저장하기
	public List<ConcertIdResponse> getConcertByPeriod(Integer maxSize) {
		// 오늘로부터 앞으로 한달 이내로 기간 설정
		final LocalDateTime startTime = LocalDate.now().atStartOfDay();
		final LocalDateTime endTime = LocalDate.now().plusMonths(1).atStartOfDay().minusSeconds(1);

		// http 요청 url 생성
		UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(concertListRequestUrl)
			.queryParam("service", apiKey)
			.queryParam("stdate", startTime.format(DateTimeFormatter.ofPattern("yyyyMMdd")))
			.queryParam("eddate", endTime.format(DateTimeFormatter.ofPattern("yyyyMMdd")))
			.queryParam("cpage", 1)
			.queryParam("rows", maxSize)
			.queryParam("shcate", "CCCD")
			.build();

		// 생성한 url로 요청 보내고 List로 공연 목록 받아오기
		ResponseEntity<String> result = getForEntity(uriBuilder.toString());
		KopisConcertList kopisConcertList = new KopisConcertList();
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(KopisConcertList.class);
			Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
			kopisConcertList = (KopisConcertList)unmarshaller.unmarshal(new StringReader(result.getBody()));
		} catch (JAXBException e) {
			e.printStackTrace();
		}
		List<KopisConcertList.ConcertInfo> concertInfoList = kopisConcertList.getConcertInfoList() == null ?
			new ArrayList<>() : kopisConcertList.getConcertInfoList();

		// DB에 있는 특정 기간 내의 공연들의 kopisConcertId 정보
		List<String> kopisConcertIdListFromDB = concertQueryDslRepository.searchAllKopisConcertIdByPeriod(startTime,
			endTime);
		Set<String> kopisConcertIdSetFromDB = new HashSet<>();
		kopisConcertIdSetFromDB.addAll(kopisConcertIdListFromDB);

		// 중복되지 않는 요소들을 데이터베이스에 저장
		List<ConcertIdResponse> responses = new ArrayList<>();
		for (KopisConcertList.ConcertInfo concertInfo : concertInfoList) {
			if (!kopisConcertIdSetFromDB.contains(concertInfo.getKopisConcertId())) {
				// 공연 상세 정보, 공연장 위치 정보 조회
				KopisConcertDetail.Info concertDetail = getConcertDetail(concertInfo.getKopisConcertId());
				if (concertDetail == null) throw new EmptyConcertDetailException();
				KopisPlaceDetail.Info placeDetail = getPlaceDetail(concertDetail.getKopisPlaceId());

				// 공연 객체 생성 후 저장
				Concert concert = Concert.builder()
					.title(concertDetail.getTitle())
					.imageUrl(concertDetail.getImageUrl())
					.place(concertDetail.getPlace())
					.startTime(parseLocalDateTime(concertDetail.getStartDate(), concertDetail.getTimeInfo()))
					.longitude(Double.parseDouble(placeDetail.getLongitude()))
					.latitude(Double.parseDouble(placeDetail.getLatitude()))
					.bookmarkCount(0)
					.kopisConcertId(concertInfo.getKopisConcertId())
					.build();
				Long concertId = concertRepository.save(concert).getId();
				responses.add(new ConcertIdResponse(concertId));
			}
		}

		// 새로 생성된 공연의 id 목록 반환
		return responses;
	}

	// 시연에 필요한 임의 콘서트 생성
	// if ("204".equals(keyword)) {
	// 	concertInfoList.add(KopisConcertList.ConcertInfo.builder()
	// 		.kopisConcertId("HG216423")
	// 		.imageUrl("https://shorturl.at/kvxEQ")
	// 		.place("낙성대 커피 어반")
	// 		.startDate("2023-05-11")
	// 		.title("박다솜 단독공연 페스티벌").build());
	// 	concertInfoList.add(KopisConcertList.ConcertInfo.builder()
	// 		.kopisConcertId("HG216424")
	// 		.imageUrl("https://shorturl.at/dEP15")
	// 		.place("역삼역 멀티켐퍼스")
	// 		.startDate("2023-05-11")
	// 		.title("김규연 단독콘서트 Op.1").build());
	// 	concertInfoList.add(KopisConcertList.ConcertInfo.builder()
	// 		.kopisConcertId("HG080905")
	// 		.imageUrl("https://shorturl.at/acqGS")
	// 		.place("학동역 투썸플레이스")
	// 		.startDate("2023-05-11")
	// 		.title("불타는 김동현 전국투어 콘서트").build());

	// http 요청 객체를 만드는 메서드
	private ResponseEntity<String> getForEntity(String uri) {
		// https 요청 객체 선언
		HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
		factory.setConnectTimeout(3000); // 커넥션 타임 아웃 설정 3초
		factory.setReadTimeout(3000); // 리드 타임 아웃 설정 3초

		// RestTemplate 객체 선언
		RestTemplate restTemplate = new RestTemplate(factory);

		// http 헤더 설정
		HttpHeaders headers = new HttpHeaders();
		headers.setAccept(Arrays.asList(MediaType.APPLICATION_XML));
		HttpEntity<String> entity = new HttpEntity<>(headers);

		return restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
	}

	// kopis api에서 kopisConcertId로 공연 상세 정보 조회
	private KopisConcertDetail.Info getConcertDetail(String concertId) {
		// http 요청 url 생성
		UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(concertDetailRequestUrl + "/" + concertId)
			.queryParam("service", apiKey)
			.build(true);
		ResponseEntity<String> result = getForEntity(uriBuilder.toString());

		// 공연 상세 정보 호출
		KopisConcertDetail kopisConcertDetail = new KopisConcertDetail();
		KopisConcertDetail.Info concertDetail = null;
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(KopisConcertDetail.class);
			Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
			kopisConcertDetail = (KopisConcertDetail)unmarshaller.unmarshal(new StringReader(result.getBody()));
			concertDetail = kopisConcertDetail.getInfo().get(0);
		} catch (JAXBException e) {
			e.printStackTrace();
		} catch (NullPointerException e) {
			throw new GlobalBaseException(GlobalErrorCode.KOPIS_CONCET_NOT_FOUND);
		}

		return concertDetail;
	}

	// 공연 시설 상세 정보 호출
	private KopisPlaceDetail.Info getPlaceDetail(String placeId) {
		// http 요청 url 생성
		UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(placeDetailRequestUrl + "/" + placeId)
			.queryParam("service", apiKey)
			.build(true);
		ResponseEntity<String> result = getForEntity(uriBuilder.toString());

		// 공연 시설 상세 정보 호출
		KopisPlaceDetail kopisPlaceDetail = new KopisPlaceDetail();
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(KopisPlaceDetail.class);
			Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
			kopisPlaceDetail = (KopisPlaceDetail)unmarshaller.unmarshal(new StringReader(result.getBody()));
		} catch (JAXBException e) {
			e.printStackTrace();
		}
		KopisPlaceDetail.Info placeDetail = kopisPlaceDetail.getInfo().get(0);
		return placeDetail;
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
}
