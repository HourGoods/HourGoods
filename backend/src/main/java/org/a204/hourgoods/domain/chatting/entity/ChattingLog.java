package org.a204.hourgoods.domain.chatting.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.global.common.BaseTime;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "chatting_log")
public class ChattingLog extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "content")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatting_room_id")
    private DirectChattingRoom directChattingRoom;

}