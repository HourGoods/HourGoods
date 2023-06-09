package org.a204.hourgoods.domain.chatting.entity;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import lombok.Builder;
import lombok.Getter;

@Getter
@RedisHash(value = "chatRedis")
public class DirectMessage implements Serializable {

	private static final long serialVersionUID = -8304525817629560393L;

	@Id
	private final String id;

	private final String senderId;

	private final String senderNickname;

	@Indexed
	private final String chattingRoomId;

	private final String sendTime;

	private final String content;

	@Builder
	public DirectMessage(final String id, final String chattingRoomId, final String senderId,
		final String senderNickname, final String content, final String sendTime) {
		this.id = id;
		this.chattingRoomId = chattingRoomId;
		this.senderId = senderId;
		this.senderNickname = senderNickname;
		this.content = content;
		this.sendTime = sendTime;
	}

}
