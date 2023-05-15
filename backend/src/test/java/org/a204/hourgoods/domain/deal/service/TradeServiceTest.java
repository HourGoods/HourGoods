package org.a204.hourgoods.domain.deal.service;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;

import javax.persistence.EntityManager;

import org.a204.hourgoods.CustomSpringBootTest;
import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.entity.Trade;
import org.a204.hourgoods.domain.deal.entity.TradeLocation;
import org.a204.hourgoods.domain.deal.exception.PurchaserNotFoundException;
import org.a204.hourgoods.domain.deal.exception.SellerNotFoundException;
import org.a204.hourgoods.domain.deal.exception.SellerNotValidException;
import org.a204.hourgoods.domain.deal.exception.TradeNotFoundException;
import org.a204.hourgoods.domain.deal.repository.TradeLocationRepository;
import org.a204.hourgoods.domain.deal.request.CreateTradeLocationRequest;
import org.a204.hourgoods.domain.deal.request.TradeMessageRequest;
import org.a204.hourgoods.domain.deal.response.CreateTradeLocationResponse;
import org.a204.hourgoods.domain.deal.response.TradeMessageResponse;
import org.a204.hourgoods.domain.member.entity.Member;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

@CustomSpringBootTest
@Transactional
class TradeServiceTest {
	@Autowired
	private TradeService tradeService;
	@Autowired
	private EntityManager em;
	@Autowired
	private TradeLocationRepository tradeLocationRepository;
	private Member seller;
	private Member purchaser;
	private Concert concert;
	private Trade trade;

	@BeforeEach
	void setUp() {
		// 유저 생성
		seller = Member.builder()
			.email("yeji@hourgoods.com")
			.nickname("yezi")
			.build();
		em.persist(seller);

		purchaser = Member.builder()
			.email("dong@hourgoods.com")
			.nickname("yerinFan")
			.build();
		em.persist(purchaser);

		// 공연 생성
		concert = Concert
			.builder()
			.title("백예린 단독공연, Square")
			.imageUrl("http://www.kopis.or.kr/upload/pfmPoster/PF_PF216426_230407_152630.gif")
			.longitude(Double.valueOf(127.12836360000006))
			.latitude(Double.valueOf(37.52112))
			.place("올림픽공원 (SK핸드볼경기장(펜싱경기장))")
			.startTime(LocalDateTime.parse("2023-05-19T20:00:00"))
			.kopisConcertId("PF216426")
			.build();
		em.persist(concert);

		// 1:1 거래 생성
		trade = Trade
			.tradeBuilder()
			.title("백예린 한정판 포카 판매합니다~!")
			.dealType(DealType.Trade)
			.startTime(LocalDateTime.now().plusHours(6))
			.concert(concert)
			.dealHost(seller)
			.price(Integer.valueOf(30000))
			.build();
		em.persist(trade);
	}

	@Nested
	@DisplayName("실시간 위치 정보 생성 확인 및 정보 id 반환 TEST")
	class CreateTradeLocation {
		private CreateTradeLocationRequest request;
		private CreateTradeLocationResponse response;

		@Test
		@DisplayName("위치 정보가 없을 때 생성 후 id 반환 성공")
		void createTradeLocationSuccess() {
			// Input
			request = CreateTradeLocationRequest.builder()
				.dealId(trade.getId())
				.sellerNickname(seller.getNickname())
				.purchaserNickname(purchaser.getNickname())
				.build();

			// Output
			response = tradeService.createTradeLocation(request);
			TradeLocation tradeLocationResponse = tradeLocationRepository.findById(response.getTradeLocationId())
				.orElseThrow();

			// Validation
			assertEquals(request.getDealId().toString(), tradeLocationResponse.getDealId());
			assertEquals(seller.getId().toString(), tradeLocationResponse.getSellerId());
			assertEquals(purchaser.getId().toString(), tradeLocationResponse.getPurchaserId());
		}

		@Test
		@DisplayName("위치 정보가 있을 때 id 반환 성공")
		void getTradeLocationIdSuccess() {
			// 위치 정보 생성
			TradeLocation tradeLocation = TradeLocation.builder()
				.dealId(trade.getId().toString())
				.sellerId(seller.getId().toString())
				.sellerLongitude(null)
				.sellerLatitude(null)
				.purchaserId(purchaser.getId().toString())
				.purchaserLongitude(null)
				.purchaserLatitude(null)
				.distance(null)
				.build();
			String tradeLocationId = tradeLocationRepository.save(tradeLocation).getId();

			// Input
			request = CreateTradeLocationRequest.builder()
				.dealId(trade.getId())
				.sellerNickname(seller.getNickname())
				.purchaserNickname(purchaser.getNickname())
				.build();

			// Output
			response = tradeService.createTradeLocation(request);
			TradeLocation tradeLocationResponse = tradeLocationRepository.findById(response.getTradeLocationId())
				.orElseThrow();

			// Validation
			assertEquals(tradeLocationId, tradeLocationResponse.getId());
			assertEquals(request.getDealId().toString(), tradeLocationResponse.getDealId());
			assertEquals(seller.getId().toString(), tradeLocationResponse.getSellerId());
			assertEquals(purchaser.getId().toString(), tradeLocationResponse.getPurchaserId());
		}

		@Test
		@DisplayName("존재하지 않는 거래 id로 인한 실패")
		void dealNotFoundFail() {
			// Input
			request = CreateTradeLocationRequest.builder()
				.dealId(Long.valueOf(-1))
				.sellerNickname(seller.getNickname())
				.purchaserNickname(purchaser.getNickname())
				.build();

			// Validation
			assertThrows(TradeNotFoundException.class, () -> tradeService.createTradeLocation(request));
		}

		@Test
		@DisplayName("판매자 닉네임과 일치하는 사용자가 없어 실패")
		void notValidSellerNicknameFail() {
			// Input
			request = CreateTradeLocationRequest.builder()
				.dealId(trade.getId())
				.sellerNickname("누가닉네임을이렇게지어놓겠어요")
				.purchaserNickname(purchaser.getNickname())
				.build();

			// Validation
			assertThrows(SellerNotFoundException.class, () -> tradeService.createTradeLocation(request));
		}

		@Test
		@DisplayName("구매자 닉네임과 일치하는 사용자가 없어 실패")
		void notValidPurchaserFail() {
			// Input
			request = CreateTradeLocationRequest.builder()
				.dealId(trade.getId())
				.sellerNickname(seller.getNickname())
				.purchaserNickname("누가닉네임을이렇게지어놓겠어요")
				.build();

			// Validation
			assertThrows(PurchaserNotFoundException.class, () -> tradeService.createTradeLocation(request));
		}

		@Test
		@DisplayName("거래 등록자와 판매자 정보 불일치로 인한 실패")
		void notValidSellerFail() {
			// Input
			request = CreateTradeLocationRequest.builder()
				.dealId(trade.getId())
				.sellerNickname(purchaser.getNickname())
				.purchaserNickname(purchaser.getNickname())
				.build();

			// Validation
			assertThrows(SellerNotValidException.class, () -> tradeService.createTradeLocation(request));
		}
	}

	@Nested
	@DisplayName("실시간 위치 정보 갱신 TEST")
	class UpdateTradeLocation {
		private TradeLocation tradeLocation;
		private String tradeLocationId;

		@BeforeEach
		void setUp() {
			tradeLocation = TradeLocation.builder()
				.dealId(trade.getId().toString())
				.sellerId(seller.getId().toString())
				.sellerLongitude(null)
				.sellerLatitude(null)
				.purchaserId(purchaser.getId().toString())
				.purchaserLongitude(null)
				.purchaserLatitude(null)
				.distance(null)
				.build();
			tradeLocationId = tradeLocationRepository.save(tradeLocation).getId();
		}

		@Test
		@DisplayName("실시간 위치 정보 갱신 성공")
		void updateTradeLocationSuccess() {
			TradeMessageRequest request = new TradeMessageRequest().builder()
				.tradeLocationId(tradeLocationId)
				.nickname(seller.getNickname())
				.longitude(127.1)
				.latitude(38.1)
				.build();

			TradeMessageResponse response = tradeService.updateTradeLocation(request);

			assertEquals(tradeLocationId, response.getTradeLocationId());
			assertEquals(trade.getId(), response.getDealId());
			assertEquals(request.getNickname(), response.getSellerNickname());
			assertEquals(purchaser.getNickname(), response.getPurchaserNickname());
			assertEquals(request.getNickname(), response.getSellerLocationInfo().getOtherNickname());
			assertEquals(request.getLongitude(), response.getSellerLocationInfo().getOtherLongitude());
			assertEquals(request.getLatitude(), response.getSellerLocationInfo().getOtherLatitude());
			assertEquals(purchaser.getNickname(), response.getPurchaserLocationInfo().getOtherNickname());
			assertEquals(tradeLocation.getPurchaserLongitude(),
				response.getPurchaserLocationInfo().getOtherLongitude());
			assertEquals(tradeLocation.getPurchaserLatitude(), response.getPurchaserLocationInfo().getOtherLatitude());
			if (tradeLocation.getPurchaserLongitude() == null || tradeLocation.getPurchaserLatitude() == null) {
				assertNull(response.getSellerLocationInfo().getDistance());
				assertNull(response.getPurchaserLocationInfo().getDistance());
			} else {
				assertNull(response.getSellerLocationInfo().getDistance());
				assertNull(response.getPurchaserLocationInfo().getDistance());
				assertEquals(response.getSellerLocationInfo().getDistance(),
					response.getPurchaserLocationInfo().getDistance());
			}
		}

	}
}