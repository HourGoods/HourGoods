package org.a204.hourgoods.domain.deal.contorller;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.EntityManager;

import org.a204.hourgoods.CustomSpringBootTest;
import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.deal.entity.Auction;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.DealBookmark;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.entity.GameAuction;
import org.a204.hourgoods.domain.deal.entity.Sharing;
import org.a204.hourgoods.domain.deal.entity.Trade;
import org.a204.hourgoods.domain.deal.repository.DealRepository;
import org.a204.hourgoods.domain.deal.request.BookmarkRequest;
import org.a204.hourgoods.domain.deal.request.DealCreateRequest;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.a204.hourgoods.global.security.jwt.JwtTokenUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.fasterxml.jackson.databind.ObjectMapper;

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
	@LocalServerPort
	int port;
	private final String url = "http://localhost:" + port + "/api/deal/";
	private Long CONCERT_ID;
	private Long DEAL_ID;
	private Long MEMBER_ID;
	private Deal deal;
	private Member member;
	@Autowired
	private MemberRepository memberRepository;
	@Autowired
	private DealRepository dealRepository;

	@BeforeEach
	void setUp() {
		// 유저 생성
		member = Member.builder()
			.email("yeji@hourgoods.com")
			.nickname("yezi")
			.build();
		em.persist(member);
		MEMBER_ID = member.getId();
		token = jwtTokenUtils.BEARER_PREFIX + jwtTokenUtils.createTokens(member,
			List.of(new SimpleGrantedAuthority("ROLE_MEMBER")));
		// 콘서트 생성
		Concert concert = Concert.builder()
			.title("아이유 콘서트")
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
				.dealType(DealType.HourAuction)
				.startTime(LocalDateTime.now().plusHours(8 - i))
				.minimumPrice(10_000)
				.concert(concert)
				.dealHost(member)
				.longitude(126.9780)
				.latitude(37.5665)
				.build();
			em.persist(gameAuction);
			deal = gameAuction;
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
					.header("Authorization", token)
					.params(request))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}
	}

	@Nested
	@DisplayName("거래 생성")
	class createDeal {
		@Test
		@DisplayName("거래 생성 성공")
		void createDeal() throws Exception {
			// given
			String content = objectMapper.writeValueAsString(DealCreateRequest.builder()
				.imageUrl("testUrl")
				.title("testTitle")
				.content("testContent")
				.startTime(LocalDateTime.now())
				.longitude(Double.valueOf("127.0"))
				.latitude(Double.valueOf("39.0"))
				.minimumPrice(Integer.valueOf("10000"))
				.endTime(LocalDateTime.now())
				.concertId(CONCERT_ID)
				.meetingLocation("역삼역 3번 출구 앞")
				.dealType(String.valueOf(DealType.Auction))
				.build()
			);

			mockMvc
				.perform(post(url + "create")
					.header("Authorization", token)
					.contentType(MediaType.APPLICATION_JSON)
					.content(content))
				.andExpect(jsonPath("$.status", is(200)))
				.andExpect(jsonPath("$.result.dealId").isNumber())
				.andDo(print());
		}
	}

	@Nested
	@DisplayName("거래 삭제")
	class deleteDeal {
		private String otherToken;

		@BeforeEach
		void setUp() {
			Member otherMember = Member.builder()
				.email("johan@hourgoods.com")
				.imageUrl("https://shorturl.at/bix17")
				.nickname("americaRabbit").build();
			em.persist(otherMember);
			otherToken = jwtTokenUtils.BEARER_PREFIX + jwtTokenUtils.createTokens(otherMember,
				List.of(new SimpleGrantedAuthority("ROLE_MEMBER")));
		}

		@Test
		@DisplayName("거래 삭제 성공")
		void deleteDeal() throws Exception {
			mockMvc
				.perform(delete(url + DEAL_ID.toString())
					.header("Authorization", token))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}

		@Test
		@DisplayName("없는 거래ID 조회")
		void invalidDealId() throws Exception {
			mockMvc
				.perform(delete(url + "-1")
					.header("Authorization", token))
				.andExpect(jsonPath("$.status", is(404)))
				.andExpect(jsonPath("$.code", is("D200")))
				.andDo(print());
		}

		@Test
		@DisplayName("거래 생성 멤버ID와 요청 멤버ID 불일치")
		void missMatchMemberId() throws Exception {
			mockMvc
				.perform(delete(url + DEAL_ID.toString())
					.header("Authorization", otherToken))
				.andExpect(jsonPath("$.status", is(400)))
				.andExpect(jsonPath("$.code", is("M400")))
				.andDo(print());
		}
	}

	@Nested
	@DisplayName("북마크 생성 / 삭제")
	class Bookmark {
		@Test
		@DisplayName("북마크 생성 성공")
		void registBookmark() throws Exception {
			//given
			String content = objectMapper.writeValueAsString(
				BookmarkRequest.builder().dealId(DEAL_ID).build()
			);
			//then
			mockMvc
				.perform(post(url + "bookmark")
					.header("Authorization", token)
					.contentType(MediaType.APPLICATION_JSON)
					.content(content))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}

		@Test
		@DisplayName("묵마크 생성 중 거래ID 조회 실패")
		void invalidDealIdInRegistration() throws Exception {
			//given
			String content = objectMapper.writeValueAsString(
				BookmarkRequest.builder().dealId(-1L).build()
			);
			//then
			mockMvc
				.perform(post(url + "bookmark")
					.header("Authorization", token)
					.contentType(MediaType.APPLICATION_JSON)
					.content(content))
				.andExpect(jsonPath("$.status", is(404)))
				.andExpect(jsonPath("$.code", is("D200")))
				.andDo(print());
		}

		@Test
		@DisplayName("북마크 취소 성공")
		void cancelBookmark() throws Exception {
			//given
			Member member = memberRepository.findById(MEMBER_ID).orElseThrow();
			Deal deal = dealRepository.findById(DEAL_ID).orElseThrow();
			DealBookmark bookmark = DealBookmark.builder()
				.member(member)
				.deal(deal).build();
			em.persist(bookmark);
			String content = objectMapper.writeValueAsString(
				BookmarkRequest.builder().dealId(DEAL_ID).build()
			);
			//when
			mockMvc
				.perform(delete(url + "bookmark")
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", token)
					.content(content))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}

		@Test
		@DisplayName("북마크 취소 중 북마크 조회 실패")
		void invalidBookmarkInCancellation() throws Exception {
			//given
			String content = objectMapper.writeValueAsString(
				BookmarkRequest.builder().dealId(DEAL_ID).build()
			);
			//when
			mockMvc
				.perform(delete(url + "bookmark")
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", token)
					.content(content))
				.andExpect(jsonPath("$.status", is(404)))
				.andExpect(jsonPath("$.code", is("D300")))
				.andDo(print());
		}
	}

	@Nested
	@DisplayName("북마크 여부 확인")
	class checkBookmark {
		@Test
		@DisplayName("북마크 여부 확인 성공")
		void bookmarkCheck() throws Exception {
			// given
			DealBookmark bookmark = DealBookmark.builder()
				.deal(deal).member(member).build();
			em.persist(bookmark);
			em.flush();
			em.clear();
			// when
			mockMvc
				.perform(get(url + "bookmark")
					.header("Authorization", token)
					.param("dealId", DEAL_ID.toString()))
				// then
				.andExpect(jsonPath("$.status", is(200)))
				.andExpect(jsonPath("$.result.isBookmarked", is(true)))
				.andDo(print());
		}
	}
}
