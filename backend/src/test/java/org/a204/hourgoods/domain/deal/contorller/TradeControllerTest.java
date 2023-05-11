package org.a204.hourgoods.domain.deal.contorller;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;

import javax.persistence.EntityManager;

import org.a204.hourgoods.CustomSpringBootTest;
import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.entity.Trade;
import org.a204.hourgoods.domain.deal.entity.TradeLocation;
import org.a204.hourgoods.domain.deal.repository.TradeLocationRepository;
import org.a204.hourgoods.domain.deal.request.CreateTradeLocationRequest;
import org.a204.hourgoods.domain.deal.request.TradeMessageRequest;
import org.a204.hourgoods.domain.deal.response.CreateTradeLocationResponse;
import org.a204.hourgoods.domain.deal.response.TradeMessageResponse;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.global.common.BaseResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@CustomSpringBootTest
@Transactional
@AutoConfigureMockMvc
class TradeControllerTest {
	@Autowired
	private EntityManager em;
	@Autowired
	private MockMvc mockMvc;
	@Autowired
	private ObjectMapper objectMapper;
	@Autowired
	private RedisTemplate<String, Object> redisTemplate;
	@Autowired
	private TradeLocationRepository tradeLocationRepository;
	@LocalServerPort
	private int port;
	private final String url = "http://localhost:" + port + "/api/deal/trade/";
	private Member seller;
	private Member purchaser;
	private Concert concert;
	private Trade trade;
	private TradeLocation tradeLocation;

	@BeforeEach
	void setUp() {
		// Redis DB 초기화
		redisTemplate.getConnectionFactory().getConnection().flushAll();

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

	private static class TestStompFrameHandler implements StompFrameHandler {

		private final BlockingQueue<String> messageQueue = new LinkedBlockingDeque<>();

		@Override
		public Type getPayloadType(StompHeaders stompHeaders) {
			return byte[].class;
		}

		@Override
		public void handleFrame(StompHeaders stompHeaders, Object o) {
			String message = new String((byte[])o);
			messageQueue.add(message);
		}

		public String getReceivedMessage(long timeout, TimeUnit unit) throws InterruptedException {
			return messageQueue.poll(timeout, unit);
		}

	}

	@Nested
	@DisplayName("실시간 위치 확인 API TEST")
	class CreateTradeLocation {
		@Test
		@DisplayName("실시간 위치 정보 생성 및 정보 id 조회 성공")
		void createAndGetTradeLocationSuccess() throws Exception {
			CreateTradeLocationRequest request = CreateTradeLocationRequest.builder()
				.dealId(trade.getId())
				.sellerNickname(seller.getNickname())
				.purchaserNickname(purchaser.getNickname())
				.build();
			String content = objectMapper.writeValueAsString(request);

			MockHttpServletResponse response = mockMvc
				.perform(post(url)
					.contentType(MediaType.APPLICATION_JSON)
					.content(content))
				.andExpect(jsonPath("$.status", is(200)))
				.andExpect(jsonPath("$.code", is("G000")))
				.andDo(print())
				.andReturn()
				.getResponse();
			BaseResponse<CreateTradeLocationResponse> baseResponse = objectMapper.readValue(
				response.getContentAsString(), new TypeReference<>() {
				});
			TradeLocation tradeLocationResponse = tradeLocationRepository.findById(
				baseResponse.getResult().getTradeLocationId()).orElseThrow();

			assertNotNull(tradeLocationResponse.getId());
			assertEquals(trade.getId().toString(), tradeLocationResponse.getDealId());
			assertEquals(seller.getId().toString(), tradeLocationResponse.getSellerId());
			assertEquals(purchaser.getId().toString(), tradeLocationResponse.getPurchaserId());
			assertNull(tradeLocationResponse.getSellerLongitude());
			assertNull(tradeLocationResponse.getSellerLatitude());
			assertNull(tradeLocationResponse.getPurchaserLongitude());
			assertNull(tradeLocationResponse.getPurchaserLatitude());
			assertNull(tradeLocationResponse.getDistance());
		}

		@Test
		@DisplayName("실시간 위치 정보 id 조회 성공")
		void getTradeLocationSuccess() throws Exception {
			// 테스트 환경 유효성 검사(Redis DB 초기화 했는지 검사)
			assertFalse(tradeLocationRepository.existsByDealIdAndSellerIdAndPurchaserId(trade.getId().toString(),
				seller.getId().toString(), purchaser.getId().toString()));

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
			String tradeLocationId = tradeLocationRepository.save(tradeLocation).getId();

			CreateTradeLocationRequest request = CreateTradeLocationRequest.builder()
				.dealId(trade.getId())
				.sellerNickname(seller.getNickname())
				.purchaserNickname(purchaser.getNickname())
				.build();
			String content = objectMapper.writeValueAsString(request);

			MockHttpServletResponse response = mockMvc
				.perform(post(url)
					.contentType(MediaType.APPLICATION_JSON)
					.content(content))
				.andExpect(jsonPath("$.status", is(200)))
				.andExpect(jsonPath("$.code", is("G000")))
				.andDo(print())
				.andReturn()
				.getResponse();
			BaseResponse<CreateTradeLocationResponse> baseResponse = objectMapper.readValue(
				response.getContentAsString(), new TypeReference<>() {
				});
			TradeLocation tradeLocationResponse = tradeLocationRepository.findById(
				baseResponse.getResult().getTradeLocationId()).orElseThrow();

			assertEquals(tradeLocationId, tradeLocationResponse.getId());
			assertEquals(trade.getId().toString(), tradeLocationResponse.getDealId());
			assertEquals(seller.getId().toString(), tradeLocationResponse.getSellerId());
			assertEquals(purchaser.getId().toString(), tradeLocationResponse.getPurchaserId());
			assertEquals(tradeLocation.getSellerLongitude(), tradeLocationResponse.getSellerLongitude());
			assertEquals(tradeLocation.getSellerLatitude(), tradeLocationResponse.getSellerLatitude());
			assertEquals(tradeLocation.getPurchaserLongitude(), tradeLocationResponse.getPurchaserLongitude());
			assertEquals(tradeLocation.getPurchaserLatitude(), tradeLocationResponse.getPurchaserLatitude());
			assertEquals(tradeLocation.getDistance(), tradeLocationResponse.getDistance());
		}
	}

	@Nested
	@DisplayName("Web Socket TEST")
	class UpdateTradeLocation {
		private final String wsUrl = "ws://localhost:" + port + "/ws";
		private WebSocketStompClient stompClient;
		private StompSession stompSession;
		private String tradeLocationId;

		@BeforeEach
		void setUp() {
			stompClient = new WebSocketStompClient(
				new SockJsClient(List.of(new WebSocketTransport(new StandardWebSocketClient()))));
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
		@DisplayName("발행 및 구독 성공")
		void updateTradeLocationSuccess() throws Exception {
			// request
			TradeMessageRequest request = new TradeMessageRequest().builder()
				.tradeLocationId(tradeLocationId)
				.nickname(seller.getNickname())
				.longitude(127.1)
				.latitude(38.1)
				.build();

			// response
			TradeMessageResponse response = TradeMessageResponse.builder()
				.tradeLocationId(tradeLocationId)
				.dealId(Long.parseLong(tradeLocation.getDealId()))
				.sellerNickname(request.getNickname())
				.sellerLongitude(request.getLongitude())
				.sellerLatitude(request.getLatitude())
				.purchaserNickname(purchaser.getNickname())
				.purchaserLongitude(tradeLocation.getPurchaserLongitude() == null ? null :
					Double.parseDouble(tradeLocation.getPurchaserLongitude()))
				.purchaserLatitude(tradeLocation.getPurchaserLatitude() == null ? null :
					Double.parseDouble(tradeLocation.getPurchaserLatitude()))
				.distance(tradeLocation.getDistance() == null ? null : Double.parseDouble(tradeLocation.getDistance()))
				.build();

			// 세션 핸들러를 생성합니다.
			TestStompFrameHandler testStompFrameHandler = new TestStompFrameHandler();

			// 세션 핸들러를 등록합니다.
			ListenableFuture<StompSession> sessionFuture = stompClient.connect(
				wsUrl, new StompSessionHandlerAdapter() {
				});

			// 세션을 가져옵니다.
			stompSession = sessionFuture.get();

			// 특정 URL을 구독합니다.
			stompSession.subscribe("/topic/meet/" + trade.getId(), testStompFrameHandler);

			// 메시지를 전송합니다.
			// stompSession.send("/pub/meet/" + request.getDealId(),
			// 	objectMapper.writeValueAsString(request).getBytes(StandardCharsets.UTF_8));
			stompSession.send("/topic/meet/" + response.getDealId(),
				objectMapper.writeValueAsString(response).getBytes(StandardCharsets.UTF_8));

			// 메시지를 받을 때까지 대기합니다.
			String receivedMessage = testStompFrameHandler.getReceivedMessage(5, TimeUnit.SECONDS);

			// 받은 메시지가 예상한 메시지와 일치하는지 확인합니다.
			TradeMessageResponse actual = objectMapper.readValue(receivedMessage, TradeMessageResponse.class);
			assertEquals(request.getTradeLocationId(), actual.getTradeLocationId());
			assertEquals(request.getNickname(), actual.getSellerNickname());
			assertEquals(request.getLongitude(), actual.getSellerLongitude());
			assertEquals(request.getLatitude(), actual.getSellerLatitude());
		}

		@AfterEach
		public void disconnect() {
			stompSession.disconnect();
			stompClient.stop();
		}
	}
}