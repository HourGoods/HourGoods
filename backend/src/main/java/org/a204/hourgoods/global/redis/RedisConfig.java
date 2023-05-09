package org.a204.hourgoods.global.redis;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import org.a204.hourgoods.domain.chatting.entity.DirectMessage;
import org.a204.hourgoods.domain.deal.entity.AuctionInfo;
import org.a204.hourgoods.domain.deal.entity.GameAuctionInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

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

    @Bean
    public RedisTemplate<String, AuctionInfo> redisAuctionTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, AuctionInfo> template = new RedisTemplate<>();

        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());

        Jackson2JsonRedisSerializer<AuctionInfo> serializer = new Jackson2JsonRedisSerializer<>(AuctionInfo.class);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL);
        serializer.setObjectMapper(objectMapper);

        template.setValueSerializer(serializer);

        return template;
    }

    @Bean
    public RedisTemplate<String, GameAuctionInfo> redisGameTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, GameAuctionInfo> template = new RedisTemplate<>();

        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());

        Jackson2JsonRedisSerializer<GameAuctionInfo> serializer = new Jackson2JsonRedisSerializer<>(GameAuctionInfo.class);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL);
        serializer.setObjectMapper(objectMapper);

        template.setValueSerializer(serializer);

        return template;
    }
}
