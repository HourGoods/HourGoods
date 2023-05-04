package org.a204.hourgoods.domain.chatting.repository;

import org.a204.hourgoods.domain.chatting.entity.DirectMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DirectMessageRepository extends CrudRepository<DirectMessage, String> {

    List<DirectMessage> findDirectMessagesByChatRoomId(final String chatRoomId, Pageable pageable);

}
