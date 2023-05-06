package org.a204.hourgoods.domain.concert.service;

import java.io.StringReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import org.a204.hourgoods.domain.concert.model.KopisConcertDetail;
import org.a204.hourgoods.domain.concert.model.KopisConcertList;
import org.a204.hourgoods.domain.concert.model.KopisPlaceDetail;
import org.a204.hourgoods.domain.concert.response.ConcertListResponse;
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

	@Value("${spring.kopis.api-key}")
	private String apiKey;

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

	// 제목에 키워드가 포함된 미등록 공연 정보 조회
	// parameter : 위도, 경도, 키워드
	public ConcertListResponse getConcertList(String keyword) {
		// http 요청 url 생성
		UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(concertListRequestUrl)
			.queryParam("service", apiKey)
			.queryParam("stdate", LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")))
			.queryParam("eddate", LocalDate.now().plusMonths(1).format(DateTimeFormatter.ofPattern("yyyyMMdd")))
			.queryParam("cpage", 1)
			.queryParam("rows", 30)
			.queryParam("shcate", "CCCD")
			.queryParam("shprfnm", keyword)
			.build(false);

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
		System.out.println(concertInfoList.toString());

		ConcertListResponse response = ConcertListResponse.builder()
			.hasNextPage(false)
			.lastConcertId(Long.valueOf(-1))
			.concertInfoList(concertInfoList)
			.build();
		return response;
	}

	// 공연 상세 정보 조회
	public KopisConcertDetail.Info getConcertDetail(String concertId) {
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
	public KopisPlaceDetail.Info getPlaceDetail(String placeId) {
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
}
