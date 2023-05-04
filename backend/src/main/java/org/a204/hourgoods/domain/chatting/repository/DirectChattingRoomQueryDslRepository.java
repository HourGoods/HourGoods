package org.a204.hourgoods.domain.chatting.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.a204.hourgoods.domain.chatting.entity.DirectChattingRoom;
import org.a204.hourgoods.domain.chatting.entity.QDirectChattingRoom;
import org.a204.hourgoods.domain.member.entity.QMember;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
public class DirectChattingRoomQueryDslRepository {

    private final JPAQueryFactory query;

    public DirectChattingRoomQueryDslRepository(EntityManager em) {
        this.query = new JPAQueryFactory(em);
    }

    QMember receiver = QMember.member;
    QMember sender = QMember.member;
    QDirectChattingRoom directChattingRoom = QDirectChattingRoom.directChattingRoom;

    public List<DirectChattingRoom> searchAllChatListByUserId(Long userId) {
        return query.selectFrom(directChattingRoom)
                .join(directChattingRoom.receiver, receiver)
                .fetchJoin()
                .join(directChattingRoom.sender, sender)
                .fetchJoin()
                .where(
                        directChattingRoom.receiver.id.eq(userId).or(directChattingRoom.sender.id.eq(userId))
                )
                .orderBy(directChattingRoom.lastLogTime.desc())
                .fetch();
    }

}
