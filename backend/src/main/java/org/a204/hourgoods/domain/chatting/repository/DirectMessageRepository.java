package org.a204.hourgoods.domain.chatting.repository;

import java.util.List;

import org.a204.hourgoods.domain.chatting.entity.DirectMessage;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DirectMessageRepository extends CrudRepository<DirectMessage, String> {

	List<DirectMessage> findDirectMessagesByChattingRoomIdOrderBySendTimeAsc(final String chatRoomId);

}
