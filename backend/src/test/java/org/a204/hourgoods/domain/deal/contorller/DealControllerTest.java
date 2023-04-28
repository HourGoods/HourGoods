package org.a204.hourgoods.domain.deal.contorller;

import static org.hamcrest.Matchers.*;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.EntityManager;

import org.a204.hourgoods.CustomSpringBootTest;
import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.deal.entity.Auction;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.entity.GameAuction;
import org.a204.hourgoods.domain.deal.entity.Sharing;
import org.a204.hourgoods.domain.deal.entity.Trade;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.global.security.jwt.JwtTokenUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@CustomSpringBootTest
@Transactional
@AutoConfigureMockMvc
class DealControllerTest {

	@Autowired
	EntityManager em;
	@Autowired
	MockMvc mockMvc;
	@Autowired
	ObjectMapper objectMapper;
	@Autowired
	JwtTokenUtils jwtTokenUtils;
	private String token;
	private final String url = "http://localhost:8080/api/deal/";
	private Long CONCERT_ID;
	private Long DEAL_ID;

	@BeforeEach
	void setUp() {
		// 유저 생성
		Member member = Member.builder()
			.email("yeji@hourgoods.com")
			.nickname("yezi")
			.registrationId(Member.RegistrationId.kakao)
			.build();
		em.persist(member);
		token = jwtTokenUtils.BEARER_PREFIX + jwtTokenUtils.createTokens(member,
			List.of(new SimpleGrantedAuthority("ROLE_MEMBER")));
		// 콘서트 생성
		Concert concert = Concert.builder()
			.title("아이유 콘서트")
			.content("아이유 단독 콘서트입니다.")
			.imageUrl("url")
			.startTime(LocalDateTime.now().plusHours(8))
			.build();
		em.persist(concert);
		CONCERT_ID = concert.getId();
		// 나눔 거래 생성
		for (int i = 1; i < 10; i++) {
			Sharing sharing = Sharing.sharingBuilder()
				.title("포카판매합니다")
				.dealType(DealType.Sharing)
				.isAvaliable(i % 2 == 0)
				.startTime(LocalDateTime.now().plusHours(8 - i))
				.limitation(20)
				.concert(concert)
				.dealHost(member)
				.build();
			em.persist(sharing);
		}
		// 1:1 거래 생성
		for (int i = 1; i < 10; i++) {
			Trade trade = Trade.tradeBuilder()
				.title("포카판매합니다")
				.dealType(DealType.Trade)
				.isAvaliable(i % 2 == 0)
				.startTime(LocalDateTime.now().plusHours(8 - i))
				.price(i * 10_000)
				.concert(concert)
				.dealHost(member)
				.build();
			em.persist(trade);
		}
		// 경매 생성
		for (int i = 1; i < 5; i++) {
			Auction auction = Auction.auctionBuilder()
				.title("포카경매합니다")
				.dealType(DealType.Auction)
				.isAvaliable(i % 2 == 0)
				.startTime(LocalDateTime.now().plusHours(8 - i))
				.endTime(LocalDateTime.now().plusHours(8))
				.minimumPrice(10_000)
				.concert(concert)
				.dealHost(member)
				.build();
			em.persist(auction);
		}
		// 게임 경매 생성
		for (int i = 1; i < 5; i++) {
			GameAuction gameAuction = GameAuction.gameAuctionBuilder()
				.title("포카아이유 경매합니다")
				.dealType(DealType.GameAuction)
				.isAvaliable(i % 2 == 0)
				.startTime(LocalDateTime.now().plusHours(8 - i))
				.minimumPrice(10_000)
				.concert(concert)
				.dealHost(member)
				.longitude(126.9780)
				.latitude(37.5665)
				.build();
			em.persist(gameAuction);
			DEAL_ID = gameAuction.getId();
		}
	}

	@Nested
	@DisplayName("거래 목록 조회 API")
	class GetDealListByConcert {

		@Test
		@DisplayName("유효하지 않은 콘서트")
		void invalidConcert() throws Exception {
			// given
			MultiValueMap<String, String> request = new LinkedMultiValueMap<>();
			request.add("concertId", "1000000");
			request.add("lastDealId", "-1");
			request.add("dealTypeName", "All");

			mockMvc
				.perform(get(url + "list")
					.contentType(MediaType.APPLICATION_JSON)
					.params(request))
				.andExpect(jsonPath("$.status", is(404)))
				.andExpect(jsonPath("$.code", is("C100")));
		}

		@Test
		@DisplayName("유효하지 않은 거래 타입")
		void invalidDealTypeName() throws Exception {
			// given
			MultiValueMap<String, String> request = new LinkedMultiValueMap<>();
			request.add("concertId", CONCERT_ID.toString());
			request.add("lastDealId", "-1");
			request.add("dealTypeName", "INVALID");

			mockMvc
				.perform(get(url + "list")
					.contentType(MediaType.APPLICATION_JSON)
					.params(request))
				.andExpect(jsonPath("$.status", is(404)))
				.andExpect(jsonPath("$.code", is("D100")));
		}

		@Test
		@DisplayName("거래 전체 목록 조회 성공")
		void getAllDealList() throws Exception {
			// given
			MultiValueMap<String, String> request = new LinkedMultiValueMap<>();
			request.add("concertId", CONCERT_ID.toString());
			request.add("lastDealId", "-1");
			request.add("dealTypeName", "All");

			mockMvc
				.perform(get(url + "list")
					.contentType(MediaType.APPLICATION_JSON)
					.params(request))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}

		@Test
		@DisplayName("경매 목록 조회 성공")
		void getAuctionDealList() throws Exception {
			// given
			MultiValueMap<String, String> request = new LinkedMultiValueMap<>();
			request.add("concertId", CONCERT_ID.toString());
			request.add("lastDealId", "-1");
			request.add("dealTypeName", "Auction");

			mockMvc
				.perform(get(url + "list")
					.contentType(MediaType.APPLICATION_JSON)
					.params(request))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}

		@Test
		@DisplayName("키워드 검색 성공")
		void getKeywordSearchList() throws Exception {
			// given
			MultiValueMap<String, String> request = new LinkedMultiValueMap<>();
			request.add("concertId", CONCERT_ID.toString());
			request.add("lastDealId", "-1");
			request.add("dealTypeName", "All");
			request.add("searchKeyword", "아이유");

			mockMvc
				.perform(get(url + "list")
					.contentType(MediaType.APPLICATION_JSON)
					.params(request))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());

		}

	}

	@Nested
	@DisplayName("거래 아이디로 거래 상세 조회")
	class GetDealDeatilById {
		@Test
		@DisplayName("거래 상세 조회 성공")
		void getDealDetailById() throws Exception {
			// given
			MultiValueMap<String, String> request = new LinkedMultiValueMap<>();
			request.add("dealId", DEAL_ID.toString());

			mockMvc
				.perform(get(url + "detail")
					.contentType(MediaType.APPLICATION_JSON)
					.params(request))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}
	}

}
