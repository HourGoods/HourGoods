package org.a204.hourgoods.domain.deal.service;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;

import javax.persistence.EntityManager;

import org.a204.hourgoods.CustomSpringBootTest;
import org.a204.hourgoods.domain.chatting.entity.DirectChattingRoom;
import org.a204.hourgoods.domain.chatting.exception.DirectChattingRoomNotFoundException;
import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.entity.Trade;
import org.a204.hourgoods.domain.deal.entity.TradeLocation;
import org.a204.hourgoods.domain.deal.model.DoneMessageInfo;
import org.a204.hourgoods.domain.deal.repository.TradeLocationRepository;
import org.a204.hourgoods.domain.deal.request.CreateTradeLocationRequest;
import org.a204.hourgoods.domain.deal.request.DoneMessageRequest;
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
	private DirectChattingRoom directChattingRoom;

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

		directChattingRoom = DirectChattingRoom.builder()
			.deal(trade)
			.receiver(seller)
			.sender(purchaser)
			.build();
		em.persist(directChattingRoom);
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
				.chattingRoomId(directChattingRoom.getId())
				.build();

			// Output
			response = tradeService.createTradeLocation(request);
			TradeLocation tradeLocationResponse = tradeLocationRepository.findById(response.getTradeLocationId())
				.orElseThrow();

			// Validation
			assertEquals(directChattingRoom.getDeal().getId().toString(), tradeLocationResponse.getDealId());
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
				.chattingRoomId(directChattingRoom.getId())
				.build();

			// Output
			response = tradeService.createTradeLocation(request);
			TradeLocation tradeLocationResponse = tradeLocationRepository.findById(response.getTradeLocationId())
				.orElseThrow();

			// Validation
			assertEquals(tradeLocationId, tradeLocationResponse.getId());
			assertEquals(directChattingRoom.getDeal().getId().toString(), tradeLocationResponse.getDealId());
			assertEquals(seller.getId().toString(), tradeLocationResponse.getSellerId());
			assertEquals(purchaser.getId().toString(), tradeLocationResponse.getPurchaserId());
		}

		@Test
		@DisplayName("존재하지 않는 c id로 인한 실패")
		void dealNotFoundFail() {
			// Input
			request = CreateTradeLocationRequest.builder()
				.chattingRoomId(Long.valueOf(-1))
				.build();

			// Validation
			assertThrows(DirectChattingRoomNotFoundException.class, () -> tradeService.createTradeLocation(request));
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
		@DisplayName("실시간 위치 정보 갱신 성공, 상대방 위치 정보 없음으로 인한 거리 null 반환")
		void updateTradeLocationSuccessWithNullInfo() {
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
			assertEquals("Location", response.getSellerLocationInfo().getMessageType());
			assertEquals(request.getNickname(), response.getSellerLocationInfo().getOtherNickname());
			assertEquals(request.getLongitude(), response.getSellerLocationInfo().getOtherLongitude());
			assertEquals(request.getLatitude(), response.getSellerLocationInfo().getOtherLatitude());
			assertEquals("Location", response.getPurchaserLocationInfo().getMessageType());
			assertEquals(purchaser.getNickname(), response.getPurchaserLocationInfo().getOtherNickname());
			assertEquals(tradeLocation.getPurchaserLongitude(),
				response.getPurchaserLocationInfo().getOtherLongitude());
			assertEquals(tradeLocation.getPurchaserLatitude(),
				response.getPurchaserLocationInfo().getOtherLatitude());
			assertNull(response.getSellerLocationInfo().getDistance());
			assertNull(response.getPurchaserLocationInfo().getDistance());
		}

		@Test
		@Transactional
		@DisplayName("실시간 위치 정보 갱신 성공, 상대방 위치 정보와 거리 계산")
		void updateTradeLocationSuccessWithoutNullInfo() {
			System.out.println(tradeLocation.toString());

			TradeMessageRequest preRequest = new TradeMessageRequest().builder()
				.tradeLocationId(tradeLocationId)
				.nickname(seller.getNickname())
				.longitude(127.1)
				.latitude(38.1)
				.build();
			tradeService.updateTradeLocation(preRequest);

			TradeMessageRequest request = new TradeMessageRequest().builder()
				.tradeLocationId(tradeLocationId)
				.nickname(purchaser.getNickname())
				.longitude(127.1001)
				.latitude(38.1001)
				.build();
			TradeMessageResponse response = tradeService.updateTradeLocation(request);
			System.out.println(response.toString());

			assertNotNull(response.getSellerLocationInfo().getOtherLongitude());

			assertEquals(tradeLocationId, response.getTradeLocationId());
			assertEquals(trade.getId(), response.getDealId());
			assertEquals(seller.getNickname(), response.getSellerNickname());
			assertEquals(purchaser.getNickname(), response.getPurchaserNickname());
			assertEquals("Location", response.getSellerLocationInfo().getMessageType());
			assertEquals(preRequest.getNickname(), response.getSellerLocationInfo().getOtherNickname());
			assertEquals(preRequest.getLongitude().toString(),
				response.getSellerLocationInfo().getOtherLongitude().toString());
			assertEquals(preRequest.getLatitude().toString(),
				response.getSellerLocationInfo().getOtherLatitude().toString());
			assertEquals("Location", response.getSellerLocationInfo().getMessageType());
			assertEquals(request.getNickname(), response.getPurchaserLocationInfo().getOtherNickname());
			assertEquals(request.getLongitude().toString(),
				response.getPurchaserLocationInfo().getOtherLongitude().toString());
			assertEquals(request.getLatitude().toString(),
				response.getPurchaserLocationInfo().getOtherLatitude().toString());
			assertNotNull(response.getSellerLocationInfo().getDistance());
			assertNotNull(response.getPurchaserLocationInfo().getDistance());
			assertEquals(response.getSellerLocationInfo().getDistance().toString(),
				response.getPurchaserLocationInfo().getDistance().toString());
		}
	}

	@Nested
	@DisplayName("거래 종료 REQUEST TEST")
	class TerminateTrade {
		private TradeLocation tradeLocation;
		private String tradeLocationId;
		private Long dealId;
		private DoneMessageRequest request;

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

			dealId = trade.getId();
			request = DoneMessageRequest.builder()
				.tradeLocationId(tradeLocationId)
				.nickname(purchaser.getNickname())
				.build();
		}

		@Test
		@Transactional
		@DisplayName("결제 및 거래 종료 성공")
		void terminateTradeSuccess() {
			Integer sellerCashPoint = purchaser.getCashPoint();
			Integer purchaserCashPoint = purchaser.getCashPoint();
			DoneMessageInfo response = tradeService.terminateTrade(dealId, request);
			assertEquals(seller.getNickname(), response.getSellerNickname());
			assertEquals(purchaser.getNickname(), response.getPurchaserNickname());
			assertEquals(sellerCashPoint + trade.getPrice(), seller.getCashPoint());
			assertEquals(purchaserCashPoint - trade.getPrice(), purchaser.getCashPoint());
			assertFalse(trade.getIsAvailable());
			assertEquals("Done", response.getDoneMessageResponse().getMessageType());
		}

		@Test
		@Transactional
		@DisplayName("이미 완료된 거래로 인한 실패")
		void dealIsNotAvailableFail() {
			// 거래 종료 상태로 변경
			trade.falseAvailable();
			DoneMessageInfo response = tradeService.terminateTrade(dealId, request);
			assertEquals("ClosedDeal", response.getDoneMessageResponse().getMessageType());
		}

		@Test
		@Transactional
		@DisplayName("보유 캐시포인트 부족으로 인한 실패")
		void notEnoughCashPointFail() {
			// 보유 캐시포인트 0원으로 초기화
			purchaser.updateCashPoint((-1) * purchaser.getCashPoint());
			DoneMessageInfo response = tradeService.terminateTrade(dealId, request);
			assertEquals("NotEnoughCashPoint", response.getDoneMessageResponse().getMessageType());
		}
	}
}