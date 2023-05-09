package org.a204.hourgoods.domain.concert.controller;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;

import javax.persistence.EntityManager;

import org.a204.hourgoods.CustomSpringBootTest;
import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.concert.request.ConcertIdRequest;
import org.a204.hourgoods.domain.concert.response.ConcertIdResponse;
import org.a204.hourgoods.domain.concert.response.ConcertInfoResponse;
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

	@BeforeEach
	void setUp() {
		this.mockMvc = MockMvcBuilders.webAppContextSetup(ctx)
			.addFilters(new CharacterEncodingFilter("UTF-8", true))
			.build();

		concert = Concert.builder()
			.title("아이유 콘서트")
			.imageUrl("url")
			.startTime(LocalDateTime.now().plusHours(8))
			.kopisConcertId("TestIdFromDB")
			.bookmarkCount(0)
			.latitude(Double.valueOf(38))
			.longitude(Double.valueOf(126))
			.place("잠실주경기장")
			.build();
		em.persist(concert);
	}

	@Nested
	@DisplayName("공연 아이디 조회 API TEST")
	class GetConcertId {
		@Test
		@DisplayName("공연 아이디 조회 성공(DB에 존재하는 공연)")
		void getConcertIdSuccess() throws Exception {
			String content = objectMapper.writeValueAsString(new ConcertIdRequest("TestIdFromDB"));
			MockHttpServletResponse response = mockMvc
				.perform(post(url + "")
					.contentType(MediaType.APPLICATION_JSON)
					.content(content))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print())
				.andReturn()
				.getResponse();
			BaseResponse<ConcertIdResponse> concertId = objectMapper.readValue(response.getContentAsString(),
				new TypeReference<>() {
				});
			assertEquals(concert.getId(), concertId.getResult().getConcertId());
		}

		@Test
		@DisplayName("공연 아이디 조회 성공(DB에 존재하지 않는 공연)")
		void createConcertAndGetConcertIdSuccess() throws Exception {
			String content = objectMapper.writeValueAsString(new ConcertIdRequest("PF217601"));
			mockMvc
				.perform(post(url + "")
					.contentType(MediaType.APPLICATION_JSON)
					.content(content))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}

		@Test
		@DisplayName("공연 아이디 조회 실패(유효하지 않은 kopisConcertId)")
		void invalidKopisConcertId() throws Exception {
			String content = objectMapper.writeValueAsString(new ConcertIdRequest("invalidTest"));
			mockMvc
				.perform(post(url + "")
					.contentType(MediaType.APPLICATION_JSON)
					.content(content))
				.andExpect(jsonPath("$.status", is(404)))
				.andExpect(jsonPath("$.code", is("C300")))
				.andDo(print());
		}
	}

	@Nested
	@DisplayName("공연 상세 정보 조회 API TEST")
	class GetConcertDetail {
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
	@DisplayName("공연 정보 목록 조회 API TEST")
	class GetConcertList {
		@Test
		@DisplayName("공연 정보 목록 조회 성공")
		void getConcertListSuccess() throws Exception {
			mockMvc
				.perform(get(url + "search")
					.contentType(MediaType.APPLICATION_JSON)
					.param("keyword", "트롯"))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}
	}

	@Nested
	@DisplayName("오늘의 사용자 주변 공연 정보 목록 조회 API")
	class GetTodayConcertList {
		@Test
		@DisplayName("공연 정보 목록 조회 성공")
		void getTodayConcertList() throws Exception {
			mockMvc
				.perform(get(url + "today")
					.contentType(MediaType.APPLICATION_JSON)
					.param("longitude", Double.valueOf(126).toString())
					.param("latitude", Double.valueOf(38).toString()))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}
	}

}