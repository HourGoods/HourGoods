package org.a204.hourgoods.domain.concert.controller;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.EntityManager;

import org.a204.hourgoods.CustomSpringBootTest;
import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.concert.exception.ConcertNotFoundException;
import org.a204.hourgoods.domain.concert.repository.ConcertRepository;
import org.a204.hourgoods.domain.concert.response.ConcertIdResponse;
import org.a204.hourgoods.domain.concert.response.ConcertInfoResponse;
import org.a204.hourgoods.domain.concert.response.ConcertListResponse;
import org.a204.hourgoods.global.common.BaseResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@CustomSpringBootTest
@Transactional
@AutoConfigureMockMvc
class ConcertControllerTest {
	@Autowired
	EntityManager em;
	@Autowired
	MockMvc mockMvc;
	@Autowired
	WebApplicationContext ctx;
	@Autowired
	ObjectMapper objectMapper;
	@LocalServerPort
	int port;
	private final String url = "http://localhost:" + port + "/api/concert/";
	private Concert concert;
	@Autowired
	private ConcertRepository concertRepository;

	@BeforeEach
	void setUp() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx)
			.addFilters(new CharacterEncodingFilter("UTF-8", true))
			.build();

	}

	@Nested
	@DisplayName("공연 상세 정보 조회 API TEST")
	class GetConcertDetail {
		@BeforeEach
		void setUp() {
			concert = Concert
				.builder()
				.title("백예린 단독공연, Square")
				.imageUrl("http://www.kopis.or.kr/upload/pfmPoster/PF_PF216426_230407_152630.gif")
				.longitude(Double.valueOf(127.12836360000006))
				.latitude(Double.valueOf(37.52112))
				.place("올림픽공원 (SK핸드볼경기장(펜싱경기장))")
				.startTime(LocalDateTime.now())
				.kopisConcertId("PF216426")
				.build();
			em.persist(concert);
		}

		@Test
		@DisplayName("공연 상세 정보 조회 성공")
		void getConcertDetailSuccess() throws Exception {
			MockHttpServletResponse response = mockMvc
				.perform(get(url + "")
					.contentType(MediaType.APPLICATION_JSON)
					.param("concertId", Long.valueOf(concert.getId()).toString()))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print())
				.andReturn()
				.getResponse();

			BaseResponse<ConcertInfoResponse> concertInfo = objectMapper.readValue(response.getContentAsString(),
				new TypeReference<>() {
				});
			assertEquals(concert.getId(), concertInfo.getResult().getConcertId());
			assertEquals(concert.getKopisConcertId(), concertInfo.getResult().getKopisConcertId());
			assertEquals(concert.getTitle(), concertInfo.getResult().getTitle());
			assertEquals(concert.getImageUrl(), concertInfo.getResult().getImageUrl());
			assertEquals(concert.getLongitude(), concertInfo.getResult().getLongitude());
			assertEquals(concert.getLatitude(), concertInfo.getResult().getLatitude());
			assertEquals(concert.getPlace(), concertInfo.getResult().getPlace());
			assertEquals(concert.getStartTime(), concertInfo.getResult().getStartTime());
		}

		@Test
		@DisplayName("공연 상세 정보 조회 실패(유효하지 않은 id)")
		void invalidConcertId() throws Exception {
			mockMvc
				.perform(get(url + "")
					.contentType(MediaType.APPLICATION_JSON)
					.param("concertId", Long.valueOf(-1).toString()))
				.andExpect(jsonPath("$.status", is(404)))
				.andExpect(jsonPath("$.code", is("C100")))
				.andDo(print());
		}
	}

	@Nested
	@DisplayName("공연 정보 검색 API TEST")
	class GetConcertListByKeyword {

		@Test
		@DisplayName("공연 정보 검색 성공(검색된 공연 없음)")
		void getConcertListForEmptyResultSuccess() throws Exception {
			MockHttpServletResponse response = mockMvc
				.perform(get(url + "search")
					.contentType(MediaType.APPLICATION_JSON)
					.param("keyword", "백예린"))
				.andExpect(jsonPath("$.status", is(200)))
				.andExpect(jsonPath("$.code", is("G000")))
				.andDo(print())
				.andReturn()
				.getResponse();

			BaseResponse<ConcertListResponse> baseResponse = objectMapper.readValue(response.getContentAsString(),
				new TypeReference<>() {
				});
			ConcertListResponse actual = baseResponse.getResult();
			assertFalse(actual.getHasNextPage());
			assertEquals(-1, actual.getLastConcertId());
			assertTrue(actual.getConcertInfoList().isEmpty());
		}

		@Test
		@DisplayName("공연 정보 검색 성공(검색된 공연 있음)")
		void getConcertListForNotEmptyResultSuccess() throws Exception {
			concert = Concert
				.builder()
				.title("백예린 단독공연, Square")
				.imageUrl("http://www.kopis.or.kr/upload/pfmPoster/PF_PF216426_230407_152630.gif")
				.longitude(Double.valueOf(127.12836360000006))
				.latitude(Double.valueOf(37.52112))
				.place("올림픽공원 (SK핸드볼경기장(펜싱경기장))")
				.startTime(LocalDateTime.now())
				.kopisConcertId("PF216426")
				.build();
			em.persist(concert);

			MockHttpServletResponse response = mockMvc
				.perform(get(url + "search")
					.contentType(MediaType.APPLICATION_JSON)
					.param("keyword", "백예린"))
				.andExpect(jsonPath("$.status", is(200)))
				.andExpect(jsonPath("$.code", is("G000")))
				.andDo(print())
				.andReturn()
				.getResponse();

			BaseResponse<ConcertListResponse> baseResponse = objectMapper.readValue(response.getContentAsString(),
				new TypeReference<>() {
				});
			ConcertListResponse actual = baseResponse.getResult();
			assertFalse(actual.getHasNextPage());
			assertEquals(concert.getId(), actual.getLastConcertId());
			assertEquals(concert.getId(), actual.getConcertInfoList().get(0).getConcertId());
			assertEquals(1, actual.getConcertInfoList().size());
		}
	}

	@Nested
	@DisplayName("오늘의 공연 목록 조회 API TEST")
	class GetTodayConcertList {
		@Test
		@DisplayName("오늘의 공연 정보 목록 조회 성공(공연 정보 없음)")
		void getTodayConcertListForEmptyResultSuccess() throws Exception {
			concert = Concert
				.builder()
				.title("백예린 단독공연, Square")
				.imageUrl("http://www.kopis.or.kr/upload/pfmPoster/PF_PF216426_230407_152630.gif")
				.longitude(Double.valueOf(127.12836360000006))
				.latitude(Double.valueOf(37.52112))
				.place("올림픽공원 (SK핸드볼경기장(펜싱경기장))")
				.startTime(LocalDateTime.now().minusDays(1))
				.kopisConcertId("PF216426")
				.build();
			em.persist(concert);

			MockHttpServletResponse response = mockMvc
				.perform(get(url + "today")
					.contentType(MediaType.APPLICATION_JSON)
					.param("longitude", Double.valueOf(126).toString())
					.param("latitude", Double.valueOf(38).toString()))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print())
				.andReturn()
				.getResponse();

			BaseResponse<ConcertListResponse> baseResponse = objectMapper.readValue(response.getContentAsString(),
				new TypeReference<>() {
				});
			ConcertListResponse actual = baseResponse.getResult();
			assertFalse(actual.getHasNextPage());
			assertTrue(actual.getConcertInfoList().isEmpty());
			assertEquals(Long.valueOf(-1), actual.getLastConcertId());
		}

		@Test
		@DisplayName("오늘의 공연 정보 목록 조회 성공(공연 정보 있음)")
		void getTodayConcertListForNotEmptyResultSuccess() throws Exception {
			concert = Concert
				.builder()
				.title("백예린 단독공연, Square")
				.imageUrl("http://www.kopis.or.kr/upload/pfmPoster/PF_PF216426_230407_152630.gif")
				.longitude(Double.valueOf(127.12836360000006))
				.latitude(Double.valueOf(37.52112))
				.place("올림픽공원 (SK핸드볼경기장(펜싱경기장))")
				.startTime(LocalDateTime.now())
				.kopisConcertId("PF216426")
				.build();
			em.persist(concert);

			Concert concert1 = Concert
				.builder()
				.title("김동현 단독공연, Triangle")
				.imageUrl("http://www.kopis.or.kr/upload/pfmPoster/PF_PF216426_230407_152630.gif")
				.longitude(Double.valueOf(110.12836360000006))
				.latitude(Double.valueOf(60.52112))
				.place("고척스카이돔")
				.startTime(LocalDateTime.now())
				.kopisConcertId("PF216426")
				.build();
			em.persist(concert1);

			Concert concert2 = Concert
				.builder()
				.title("공조한 단독공연, Circle")
				.imageUrl("http://www.kopis.or.kr/upload/pfmPoster/PF_PF216426_230407_152630.gif")
				.longitude(Double.valueOf(120.12836360000006))
				.latitude(Double.valueOf(45.52112))
				.place("바르셀로나")
				.startTime(LocalDateTime.now())
				.kopisConcertId("PF216426")
				.build();
			em.persist(concert2);

			MockHttpServletResponse response = mockMvc
				.perform(get(url + "today")
					.contentType(MediaType.APPLICATION_JSON)
					.param("longitude", Double.valueOf(126).toString())
					.param("latitude", Double.valueOf(38).toString()))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print())
				.andReturn()
				.getResponse();
			BaseResponse<ConcertListResponse> baseResponse = objectMapper.readValue(response.getContentAsString(),
				new TypeReference<>() {
				});
			ConcertListResponse actual = baseResponse.getResult();
			assertFalse(actual.getHasNextPage());
			assertEquals(3, actual.getConcertInfoList().size());
			assertEquals(actual.getConcertInfoList().get(0).getConcertId(), concert.getId());
			assertEquals(actual.getConcertInfoList().get(1).getConcertId(), concert2.getId());
			assertEquals(actual.getConcertInfoList().get(2).getConcertId(), concert1.getId());
			assertEquals(concert1.getId(), actual.getLastConcertId());
		}
	}

	@Nested
	@DisplayName("앞으로 한 달 내의 공연 정보 갱신 API TEST")
	class UpdateConcertList {
		@Test
		@DisplayName("앞으로 한 달 내의 공연 정보 갱신 성공")
		void updateConcertListSuccess() throws Exception {
			MockHttpServletResponse response = mockMvc
				.perform(post(url + "update")
					.contentType(MediaType.APPLICATION_JSON)
					.param("maxSize", "1"))
				.andExpect(jsonPath("$.status", is(200)))
				.andExpect(jsonPath("$.code", is("G000")))
				.andDo(print())
				.andReturn()
				.getResponse();

			BaseResponse<List<ConcertIdResponse>> baseResponse = objectMapper.readValue(response.getContentAsString(),
				new TypeReference<>() {
				});
			List<ConcertIdResponse> actual = baseResponse.getResult();

			for (ConcertIdResponse idResponse : actual) {
				assertNotNull(concertRepository.findById(idResponse.getConcertId()));
				System.out.println(concertRepository.findById(idResponse.getConcertId()).get());
			}
			assertThrows(ConcertNotFoundException.class,
				() -> concertRepository.findById(Long.valueOf(actual.size() + 1))
					.orElseThrow(ConcertNotFoundException::new));
		}
	}
}