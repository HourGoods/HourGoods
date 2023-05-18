package org.a204.hourgoods.global.websocket;

import java.util.Map;

import lombok.extern.slf4j.Slf4j;
import org.a204.hourgoods.global.event.AuctionDisconnectEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
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

    private final ApplicationEventPublisher eventPublisher;

    @Autowired
    public WebSocketConfig(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

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
                Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
                if (StompCommand.SUBSCRIBE.equals(command) && sessionAttributes != null) {
                    HttpSession session = (HttpSession) sessionAttributes.get("session");
                    if (session != null) {
                        String destination = accessor.getDestination();
                        session.setAttribute("subscriptionDestination", destination);
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
                        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.DISCONNECT);
                        accessor.setSessionAttributes(session.getAttributes());
                        Map<String, Object> sessionAttributes = accessor.getSessionAttributes();
                        if (sessionAttributes != null) {
                            HttpSession httpSession = (HttpSession) sessionAttributes.get("session");
                            String subscriptionDestination = (String) httpSession.getAttribute("subscriptionDestination");
                            if (subscriptionDestination != null) {
                                if (subscriptionDestination.startsWith("/bidding")) {
                                    String dealId = subscriptionDestination.substring(9);
                                    eventPublisher.publishEvent(new AuctionDisconnectEvent(this, dealId));
                                }
                            }
                            super.afterConnectionClosed(session, closeStatus);
                        }
                    }
                };
            }
        });
    }

}
