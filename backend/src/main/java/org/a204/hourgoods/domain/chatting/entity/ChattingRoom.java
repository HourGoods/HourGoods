package org.a204.hourgoods.domain.chatting.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.global.common.BaseTime;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "chatting_room")
public class ChattingRoom extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "last_log_content")
    private String lastLogContent;

    @Column(name = "last_log_time")
    private LocalDateTime lastLogTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lower_member_id")
    private Member lowerMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "higher_member_id")
    private Member higherMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deal_id")
    private Deal deal;

    @OneToMany(mappedBy = "chattingRoom", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<ChattingLog> chattingLogs = new ArrayList<>();

}