package org.a204.hourgoods.domain.chatting.controller;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;

import javax.persistence.EntityManager;

import org.a204.hourgoods.CustomSpringBootTest;
import org.a204.hourgoods.domain.chatting.entity.DirectChattingRoom;
import org.a204.hourgoods.domain.chatting.entity.DirectMessage;
import org.a204.hourgoods.domain.chatting.model.ChatMessageRequest;
import org.a204.hourgoods.domain.chatting.repository.DirectMessageRepository;
import org.a204.hourgoods.domain.chatting.request.DirectChatRequest;
import org.a204.hourgoods.domain.chatting.request.MyDirectChatResponse;
import org.a204.hourgoods.domain.chatting.response.DirectChattingResponse;
import org.a204.hourgoods.domain.chatting.response.DirectMessageResponse;
import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.entity.Trade;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.a204.hourgoods.global.common.BaseResponse;
import org.a204.hourgoods.global.security.jwt.JwtTokenUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@CustomSpringBootTest
@Transactional
@AutoConfigureMockMvc
class ChattingControllerTest {
	private final CountDownLatch latch = new CountDownLatch(5);
	@LocalServerPort
	int port;
	private final String url = "http://localhost:" + port + "/api/chat/";
	@Autowired
	EntityManager em;
	@Autowired
	MockMvc mockMvc;
	@Autowired
	WebApplicationContext ctx;
	@Autowired
	ObjectMapper objectMapper;
	@Autowired
	JwtTokenUtils jwtTokenUtils;
	@Autowired
	DirectMessageRepository directMessageRepository;
	@Autowired
	MemberRepository memberRepository;
	private Member seller;
	private Member purchaser;
	private String sellerToken;
	private String purchaserToken;
	private Concert concert;
	private Trade trade;
	private DirectChattingRoom directChattingRoom;
	private DirectMessage directMessage;

	@BeforeEach
	void setUp() {
		// 유저 생성
		seller = Member.builder()
			.email("yeji@hourgoods.com")
			.nickname("yezi")
			.build();
		em.persist(seller);
		sellerToken = jwtTokenUtils.BEARER_PREFIX + jwtTokenUtils.createTokens(seller,
			List.of(new SimpleGrantedAuthority("ROLE_MEMBER")));

		purchaser = Member.builder()
			.email("dong@hourgoods.com")
			.nickname("yerinFan")
			.build();
		em.persist(purchaser);
		purchaserToken = jwtTokenUtils.BEARER_PREFIX + jwtTokenUtils.createTokens(purchaser,
			List.of(new SimpleGrantedAuthority("ROLE_MEMBER")));

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

		// 위 거래 채팅방 생성
		directChattingRoom = DirectChattingRoom
			.builder()
			.deal(trade)
			.sender(purchaser)
			.receiver(seller)
			.build();
		em.persist(directChattingRoom);

		// 위 거래 채팅방의 채팅 생성
		directMessage = DirectMessage
			.builder()
			.senderNickname(purchaser.getNickname())
			.chattingRoomId(directChattingRoom.getId().toString())
			.sendTime(null)
			.content("안녕하세요.. 아직 안 팔렸나요?")
			.build();
		directMessageRepository.save(directMessage);

		em.flush();
	}

	@AfterEach
	public void tearDown() {
		directMessageRepository.deleteAll();
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
	@DisplayName("HTTP API TEST")
	class httpApiTest {
		@Nested
		@DisplayName("1:1 채팅 요청 API TEST")
		class EnterDirectChatRoom {
			@Test
			@DisplayName("존재하는 1:1 채팅방 아이디 조회 성공")
			void enterDirectChatRoomSuccess() throws Exception {
				DirectChatRequest request = DirectChatRequest
					.builder()
					.dealId(trade.getId())
					.receiverNickname(seller.getNickname())
					.build();
				String content = objectMapper.writeValueAsString(request);

				MockHttpServletResponse response = mockMvc
					.perform(post(url + "direct")
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", purchaserToken)
						.content(content))
					.andExpect(jsonPath("$.status", is(200)))
					.andDo(print())
					.andReturn()
					.getResponse();

				BaseResponse<DirectChattingResponse> directChattingInfo = objectMapper.readValue(
					response.getContentAsString(),
					new TypeReference<>() {
					});
				assertEquals(directChattingRoom.getId(), directChattingInfo.getResult().getDirectChattingRoomId());
			}

			@Test
			@DisplayName("존재하지 않는 1:1 채팅방 생성 후 아이디 조회 성공")
			void createAndEnterDirectChatRoomSuccess() throws Exception {
				DirectChatRequest request = DirectChatRequest
					.builder()
					.dealId(trade.getId())
					.receiverNickname(purchaser.getNickname())
					.build();
				String content = objectMapper.writeValueAsString(request);

				mockMvc
					.perform(post(url + "direct")
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", sellerToken)
						.content(content))
					.andExpect(jsonPath("$.status", is(200)))
					.andDo(print());
			}
		}

		@Nested
		@DisplayName("채팅 내용 가져오기 API TEST")
		class GetMessagesByRoomId {
			@Test
			@DisplayName("채팅 내용 가져오기 성공")
			void getMessagesByRoomIdSuccess() throws Exception {
				String pathVariable = Long.valueOf(directChattingRoom.getId()).toString();
				MockHttpServletResponse response = mockMvc
					.perform(get(url + pathVariable + "/messages")
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", purchaserToken))
					.andExpect(jsonPath("$.status", is(200)))
					.andDo(print())
					.andReturn()
					.getResponse();

				BaseResponse<List<DirectMessageResponse>> directChattingInfo = objectMapper.readValue(
					response.getContentAsString(),
					new TypeReference<>() {
					});
				List<DirectMessageResponse> responses = new ArrayList<>();
				responses.add(DirectMessageResponse
					.builder()
					.nickname(directMessage.getSenderNickname())
					.isUser(directMessage.getSenderNickname().equals(purchaser.getNickname()))
					.sendTime(directMessage.getSendTime())
					.content(directMessage.getContent())
					.build());
				assertEquals(responses.get(0).getNickname(), directChattingInfo.getResult().get(0).getNickname());
			}
		}

		@Nested
		@DisplayName("나의 채팅 목록 가져오기 API TEST")
		class GetMyChatList {
			@Test
			@DisplayName("나의 채팅 목록 가져오기 성공")
			void getMyChatListSuccess() throws Exception {
				MockHttpServletResponse response = mockMvc
					.perform(get(url + "list")
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", purchaserToken))
					.andExpect(jsonPath("$.status", is(200)))
					.andDo(print())
					.andReturn()
					.getResponse();

				BaseResponse<List<MyDirectChatResponse>> directChattingInfo = objectMapper.readValue(
					response.getContentAsString(),
					new TypeReference<>() {
					});
				List<MyDirectChatResponse> responses = new ArrayList<>();
				responses.add(MyDirectChatResponse
					.builder()
					.chattingRoomId(directChattingRoom.getId())
					.otherNickname(seller.getNickname())
					.otherImageUrl(seller.getImageUrl())
					.lastLogContent(directChattingRoom.getLastLogContent())
					.lastLogTime(directChattingRoom.getLastLogTime())
					.build());
				assertEquals(responses.get(0).getChattingRoomId(),
					directChattingInfo.getResult().get(0).getChattingRoomId());
			}
		}
	}

	@Nested
	@DisplayName("Web Socket Test")
	class webSocketTest {
		@Nested
		@DisplayName("채팅을 Redis에 저장 및 구독 중인 사람들에게 전송 TEST")
		class SendDirectMessage {
			private WebSocketStompClient stompClient;
			private StompSession stompSession;
			// private final String wsUrl = "https://hourgoods.co.kr/ws";

			@BeforeEach
			void setUp() {
				stompClient = new WebSocketStompClient(
					new SockJsClient(List.of(new WebSocketTransport(new StandardWebSocketClient()))));

			}

			@Test
			@DisplayName("WebSocket 연결 테스트 성공")
			void connectWebSocketSuccess() throws Exception {
				final String wsUrl = "http://localhost:" + port + "/ws";
				System.out.println(wsUrl);
				stompSession = stompClient.connect(wsUrl, new WebSocketHttpHeaders(),
					new StompSessionHandlerAdapter() {
					}).get(1, TimeUnit.SECONDS);
				MockHttpServletResponse response = mockMvc
					.perform(get(wsUrl))
					.andExpect(status().isOk())
					.andDo(print())
					.andReturn()
					.getResponse();
				assertEquals("Welcome to SockJS!\n", response.getContentAsString());
			}

			@Test
			@DisplayName("WebSocket 구독 테스트 성공")
			void subscribeWebSocketSuccess() throws Exception {
				final String wsUrl = "ws://localhost:" + port + "/ws";

				// request
				ChatMessageRequest request = new ChatMessageRequest().builder()
					.nickName(purchaser.getNickname())
					.chattingRoomId(directChattingRoom.getId())
					.sendTime(LocalDateTime.now().toString())
					.content("hello world!")
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
				stompSession.subscribe("/topic/chat" + request.getChattingRoomId(), testStompFrameHandler);

				// 메시지를 전송합니다.
				stompSession.send("/topic/chat" + request.getChattingRoomId(),
					objectMapper.writeValueAsString(request).getBytes(StandardCharsets.UTF_8));

				// 메시지를 받을 때까지 대기합니다.
				String receivedMessage = testStompFrameHandler.getReceivedMessage(5, TimeUnit.SECONDS);

				// 받은 메시지가 예상한 메시지와 일치하는지 확인합니다.
				ChatMessageRequest actual = objectMapper.readValue(receivedMessage, ChatMessageRequest.class);
				assertEquals(request.getChattingRoomId(), actual.getChattingRoomId());
				assertEquals(request.getNickName(), actual.getNickName());
				assertEquals(request.getContent(), actual.getContent());
				assertEquals(request.getSendTime(), actual.getSendTime());
			}

			@AfterEach
			public void disconnect() {
				stompSession.disconnect();
				stompClient.stop();
			}

		}

	}

}