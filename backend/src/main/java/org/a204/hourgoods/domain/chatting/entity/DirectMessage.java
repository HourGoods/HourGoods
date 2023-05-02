package org.a204.hourgoods.domain.chatting.entity;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;

@Getter
@RedisHash(value = "chatRedis")
public class DirectMessage implements Serializable {

    private static final long serialVersionUID = -8304525817629560393L;

    @Id
    private final String id;

    private final String userNickName;

    @Indexed
    private final String chatRoomId;

    private final String sendTime;

    private final String content;

    @Builder
    public DirectMessage(final String id, final String chatRoomId, final String userNickName, final String content,
                         final String sendTime) {
        this.id = id;
        this.chatRoomId = chatRoomId;
        this.userNickName = userNickName;
        this.content = content;
        this.sendTime = sendTime;
    }

}
