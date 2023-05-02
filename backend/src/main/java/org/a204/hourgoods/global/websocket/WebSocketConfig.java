package org.a204.hourgoods.global.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(final StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // 연결될 엔드포인트 설정. stomp 접속 url -> /ws
                .setAllowedOriginPatterns("*")
                .withSockJS(); // SocketJS 연결 설정
    }

    @Override
    public void configureMessageBroker(final MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/pub");
        // 메시지를 발행하는 요청 url -> 메시지를 보낼 때.
        // /pub으로 시작하는 메시지만 broker에서 받아서 처리한다.

        registry.enableSimpleBroker("topic", "queue", "/enter");
        // 메시지를 구독하는 요청 url -> 메시지를 받을 때
        // 클라이언트에서 1번 채널을 구독하려고 하려면 /topic/1형식과 같은 규칙을 따라야 한다.
    }

}
