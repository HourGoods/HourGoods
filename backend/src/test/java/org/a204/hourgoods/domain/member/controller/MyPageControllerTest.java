package org.a204.hourgoods.domain.member.controller;

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
import org.a204.hourgoods.domain.deal.entity.DealBookmark;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.entity.Sharing;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.PointHistory;
import org.a204.hourgoods.domain.member.request.UpdateCashPointRequest;
import org.a204.hourgoods.domain.member.response.MyPageMemberInfoResponse;
import org.a204.hourgoods.global.common.BaseResponse;
import org.a204.hourgoods.global.security.jwt.JwtTokenUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@CustomSpringBootTest
@Transactional
@AutoConfigureMockMvc
class MyPageControllerTest {

	@Autowired
	EntityManager em;
	@Autowired
	MockMvc mockMvc;
	@Autowired
	ObjectMapper objectMapper;
	@Autowired
	JwtTokenUtils jwtTokenUtils;
	@LocalServerPort
	int port;
	private final String url = "http://localhost:" + port + "/api/mypage/";
	private Long CONCERT_ID;
	private String token;
	private String otherToken;
	private Long MEMBER_ID;
	private Member member;
	private Member otherMember;

	@BeforeEach
	void setpUp() {
		// 유저 생성
		member = Member.builder()
			.email("yeji@hourgoods.com")
			.nickname("yezi")
			.build();
		em.persist(member);
		MEMBER_ID = member.getId();
		token = jwtTokenUtils.BEARER_PREFIX + jwtTokenUtils.createTokens(member,
			List.of(new SimpleGrantedAuthority("ROLE_MEMBER")));

		// 유저 생성
		otherMember = Member.builder()
			.email("dong@hourgoods.com")
			.nickname("dong")
			.build();
		em.persist(otherMember);
		otherToken = jwtTokenUtils.BEARER_PREFIX + jwtTokenUtils.createTokens(otherMember,
			List.of(new SimpleGrantedAuthority("ROLE_MEMBER")));

		// 콘서트 생성
		Concert concert = Concert.builder()
			.title("아이유 콘서트")
			.imageUrl("url")
			.startTime(LocalDateTime.now().plusHours(8))
			.build();
		em.persist(concert);
		CONCERT_ID = concert.getId();

		for (int i = 1; i < 10; i++) {
			// 나눔 거래 생성
			Sharing sharing = Sharing.sharingBuilder()
				.title("포카판매합니다")
				.dealType(DealType.Sharing)
				.startTime(LocalDateTime.now().plusHours(8 - i))
				.limitation(20)
				.concert(concert)
				.dealHost(member)
				.build();
			em.persist(sharing);

			// 나눔 참여 기록 생성
			DealBookmark dealBookmark = DealBookmark.builder()
				.deal(sharing)
				.member(member)
				.build();
			em.persist(dealBookmark);
		}

		// 포인트 내역 생성
		PointHistory pointHistory = PointHistory.builder()
			.description("테스트 포인트 내역입니다~!")
			.amount(Integer.valueOf(-10000))
			.member(member)
			.usageTime(LocalDateTime.now())
			.build();
		em.persist(pointHistory);
	}

	@Nested
	@DisplayName("사용자가 북마크한 거래 목록 조회 API TEST")
	class GetBookmarkedDealList {
		@Test
		@DisplayName("거래 목록 조회 성공")
		void getDealList() throws Exception {
			mockMvc
				.perform(get(url + "bookmark")
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", token))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}

		@Test
		@DisplayName("결과가 빈 배열일 때 조회 성공")
		void getEmptyDealList() throws Exception {
			mockMvc
				.perform(get(url + "bookmark")
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", otherToken))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}
	}

	@Nested
	@DisplayName("사용자가 생성한 거래 목록 조회 API TEST")
	class GetCreatedDealList {
		@Test
		@DisplayName("거래 목록 조회 성공")
		void getDealList() throws Exception {
			mockMvc
				.perform(get(url + "create")
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", token))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}

		@Test
		@DisplayName("결과가 빈 배열일 때 조회 성공")
		void getEmptyDealList() throws Exception {
			mockMvc
				.perform(get(url + "create")
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", otherToken))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}
	}

	@Nested
	@DisplayName("사용자가 참여한 거래 목록 조회 API TEST")
	class GetAttendedDealList {
		@Test
		@DisplayName("거래 목록 조회 성공")
		void getDealList() throws Exception {
			mockMvc
				.perform(get(url + "attend")
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", token))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}

		@Test
		@DisplayName("결과가 빈 배열일 때 조회 성공")
		void getEmptyDealList() throws Exception {
			mockMvc
				.perform(get(url + "attend")
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", otherToken))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}
	}

	@Nested
	@DisplayName("사용자의 포인트 내역 목록 조회 API TEST")
	class GetPointHistoryList {
		@Test
		@DisplayName("포인트 내역 목록 조회 성공")
		void getPointHistoryList() throws Exception {
			mockMvc
				.perform(get(url + "point")
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", token))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}

		@Test
		@DisplayName("결과가 빈 배열일 때 조회 성공")
		void getEmptyPointHistoryList() throws Exception {
			mockMvc
				.perform(get(url + "point")
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", otherToken))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}
	}

	@Nested
	@DisplayName("사용자 포인트 충전 API TEST")
	class UpdateMemberCashPoint {
		@Test
		@DisplayName("포인트 충전 성공")
		void updateMemberCashPointSuccess() throws Exception {
			Integer memberCashPoint = otherMember.getCashPoint();
			Integer inputCashPoint = 10000;
			UpdateCashPointRequest request = UpdateCashPointRequest.builder()
				.cashPoint(inputCashPoint)
				.build();

			MockHttpServletResponse response = mockMvc
				.perform(post(url + "point")
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", otherToken)
					.content(objectMapper.writeValueAsString(request)))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print())
				.andReturn()
				.getResponse();

			BaseResponse<MyPageMemberInfoResponse> memberInfo = objectMapper.readValue(response.getContentAsString(),
				new TypeReference<>() {
				});
			assertEquals(otherMember.getNickname(), memberInfo.getResult().getNickname());
			assertEquals(otherMember.getImageUrl(), memberInfo.getResult().getImageUrl());
			assertEquals(memberCashPoint + inputCashPoint, memberInfo.getResult().getCashPoint());
			assertEquals(otherMember.getCashPoint(), memberInfo.getResult().getCashPoint());
		}

	}

	@Nested
	@DisplayName("마이페이지 사용자 정보 조회 API TEST")
	class GetMyPageMemberInfo {
		@Test
		@DisplayName("사용자 정보 조회 성공")
		void GetMyPageMemberInfoSuccess() throws Exception {
			MockHttpServletResponse response = mockMvc
				.perform(get(url)
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", otherToken))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print())
				.andReturn()
				.getResponse();

			BaseResponse<MyPageMemberInfoResponse> memberInfo = objectMapper.readValue(response.getContentAsString(),
				new TypeReference<>() {
				});
			assertEquals(otherMember.getNickname(), memberInfo.getResult().getNickname());
			assertEquals(otherMember.getImageUrl(), memberInfo.getResult().getImageUrl());
			assertEquals(otherMember.getCashPoint(), memberInfo.getResult().getCashPoint());
		}

	}

}