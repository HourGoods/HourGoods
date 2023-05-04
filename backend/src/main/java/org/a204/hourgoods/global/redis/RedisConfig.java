package org.a204.hourgoods.global.redis;

import org.a204.hourgoods.domain.chatting.entity.DirectMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

@Configuration
public class RedisConfig {

    @Value("${spring.redis.host}")
    private String host;

    @Value("${spring.redis.port}")
    private int port;

    private static final long serialVersionUID = -6687460185264018379L;

    @Bean
    public RedisTemplate<String, DirectMessage> redisTemplate() {
        final RedisTemplate<String, DirectMessage> redisTemplate = new RedisTemplate<>();
        final LettuceConnectionFactory lettuceConnectionFactory = new LettuceConnectionFactory(host, port);

        lettuceConnectionFactory.afterPropertiesSet();
        redisTemplate.setConnectionFactory(lettuceConnectionFactory);

        return redisTemplate;
    }

}
