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
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.entity.Sharing;
import org.a204.hourgoods.domain.deal.request.SharingApplyRequest;
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

import com.fasterxml.jackson.databind.ObjectMapper;

@CustomSpringBootTest
@Transactional
@AutoConfigureMockMvc
class SharingControllerTest {
	@Autowired
	EntityManager em;
	@Autowired
	MockMvc mockMvc;
	@Autowired
	ObjectMapper objectMapper;
	@Autowired
	JwtTokenUtils jwtTokenUtils;
	private String token;
	private Member member1;
	private Member member2;
	private Concert concert;
	private Sharing sharing;
	private Long auctionId;
	private final String url = "http://localhost:8080/api/deal/sharing";

	@BeforeEach
	void setup() {
		// 사용자 추가
		member1 = Member.builder()
			.imageUrl("https://shorturl.at/uCLY9")
			.email("test1@hourgoods.com")
			.nickname("test1").build();
		em.persist(member1);
		member2 = Member.builder()
			.imageUrl("https://shorturl.at/azAUY")
			.email("test2@hourgoods.com")
			.nickname("test2").build();
		token = jwtTokenUtils.BEARER_PREFIX + jwtTokenUtils.createTokens(member2,
			List.of(new SimpleGrantedAuthority("ROLE_MEMBER")));
		em.persist(member2);
		// 공연 추가
		concert = Concert.builder()
			.title("아이유 콘서트")
			.imageUrl("https://shorturl.at/rxBKZ")
			.startTime(LocalDateTime.now().minusHours(3))
			.build();
		em.persist(concert);
		// 무료 나눔 생성
		sharing = Sharing.sharingBuilder()
			.title("아이유 포카 나눔합니다")
			.dealType(DealType.Sharing)
			.isAvaliable(true)
			.startTime(LocalDateTime.now().minusHours(1))
			.limitation(20)
			.concert(concert)
			.dealHost(member1)
			.build();
		em.persist(sharing);
		// 경매 생성
		Auction auction = Auction.auctionBuilder()
			.title("포카경매합니다")
			.dealType(DealType.Auction)
			.isAvaliable(true)
			.startTime(LocalDateTime.now().minusHours(3))
			.endTime(LocalDateTime.now().minusHours(1))
			.minimumPrice(10_000)
			.concert(concert)
			.dealHost(member1)
			.build();
		em.persist(auction);
		auctionId = auction.getId();
	}
	@Nested
	@DisplayName("무료 나눔 신청 API")
	class ApplySharing {
		@Test
		@DisplayName("무료 나눔 신청 API 성공")
		void applySuccess() throws Exception {
			// given
			String content = objectMapper.writeValueAsString(
				SharingApplyRequest.builder().dealId(sharing.getId()).build()
			);
			mockMvc
				.perform(post(url + "apply")
					.header("Authorization", token)
					.contentType(MediaType.APPLICATION_JSON)
					.content(content))
				.andExpect(jsonPath("$.status", is(200)))
				.andDo(print());
		}
	}
}