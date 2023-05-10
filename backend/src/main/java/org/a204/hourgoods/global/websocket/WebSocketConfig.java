package org.a204.hourgoods.global.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;
import org.springframework.web.socket.handler.WebSocketHandlerDecoratorFactory;

import javax.servlet.http.HttpSession;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(final StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // 연결될 엔드포인트 설정. stomp 접속 url -> /ws
                .setAllowedOriginPatterns("*")
                .addInterceptors(new SessionAttributeHandshakeInterceptor())
                .withSockJS(); // SocketJS 연결 설정
    }

    @Override
    public void configureMessageBroker(final MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/pub", "/app");
        // 메시지를 발행하는 요청 url -> 메시지를 보낼 때.
        // /pub으로 시작하는 메시지만 broker에서 받아서 처리한다.

        registry.enableSimpleBroker("/topic", "/queue", "/enter", "/bidding", "/hour-bidding");
        // 메시지를 구독하는 요청 url -> 메시지를 받을 때
        // 클라이언트에서 1번 채널을 구독하려고 하려면 /topic/1형식과 같은 규칙을 따라야 한다.
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {

            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
                StompCommand command = accessor.getCommand();
                System.out.println(command.toString());
                if (StompCommand.SUBSCRIBE.equals(command)) {
                    HttpSession session = (HttpSession) accessor.getSessionAttributes().get("session");
                    if (session != null) {
                        String destination = accessor.getDestination();
                        session.setAttribute("subscriptionDestination", destination);
                        System.out.println("주소 정보 등록 완료");
                    }
                }
                return message;
            }
        });
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.addDecoratorFactory(new WebSocketHandlerDecoratorFactory() {
            @Override
            public WebSocketHandler decorate(WebSocketHandler handler) {
                return new WebSocketHandlerDecorator(handler) {
                    @Override
                    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
                        System.out.println("연결 끊어짐 이벤트!!!");
                        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.DISCONNECT);
                        accessor.setSessionAttributes(session.getAttributes());
                        HttpSession httpSession = (HttpSession) accessor.getSessionAttributes().get("session");
                        String subscriptionDestination = (String) httpSession.getAttribute("subscriptionDestination");
                        System.out.println("주소 정보: " + subscriptionDestination);
                        if (subscriptionDestination != null) {
                            System.out.println("subscriptionDestination: " + subscriptionDestination);
                            if (subscriptionDestination.startsWith("/bidding")) {
                                System.out.println("bidding uri 인식!!!");
                            } else if (subscriptionDestination.startsWith("/topic/another-prefix")) {
                                // 다른 구독 URL에 대한 처리
                                // 예: 다른 종류의 채널이나 이벤트에 대한 처리
                            }
                            // ... 여러 구독 URL에 대한 처리 ...
                        }
                        super.afterConnectionClosed(session, closeStatus);
                    }
                };
            }
        });
    }

}
