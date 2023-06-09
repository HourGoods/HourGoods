package org.a204.hourgoods.domain.chatting.model;

import org.springframework.format.annotation.DateTimeFormat;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Schema(description = "1:1 채팅 메시지 전송")
public class ChatMessageRequest {

	@Schema(description = "유저 닉네임")
	private String nickname;

	@Schema(description = "채팅방 id")
	private Long chattingRoomId;

	@DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
	@Schema(description = "메시지 보낸 시간")
	private String sendTime;

	@Schema(description = "채팅 내용")
	private String content;

}
