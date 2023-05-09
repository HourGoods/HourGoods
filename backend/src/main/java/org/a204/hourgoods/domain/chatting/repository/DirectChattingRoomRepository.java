package org.a204.hourgoods.domain.chatting.repository;

import org.a204.hourgoods.domain.chatting.entity.DirectChattingRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DirectChattingRoomRepository extends JpaRepository<DirectChattingRoom, Long> {
    Optional<DirectChattingRoom> findChattingRoomBySenderIdAndReceiverNicknameAndDealId(Long senderId, String receiverNickname, Long dealId);
}
