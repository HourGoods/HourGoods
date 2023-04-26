package org.a204.hourgoods.global.common;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
	private final List<HandlerInterceptor> interceptors;

	public WebMvcConfig(final List<HandlerInterceptor> interceptors) {
		this.interceptors = interceptors;
	}

	@Override
	public void addInterceptors(final InterceptorRegistry registry) {
		interceptors.forEach(registry::addInterceptor);
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}