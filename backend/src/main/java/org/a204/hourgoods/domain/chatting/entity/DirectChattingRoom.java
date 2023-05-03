package org.a204.hourgoods.domain.chatting.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.global.common.BaseTime;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "chatting_room")
public class DirectChattingRoom extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "last_log_content")
    private String lastLogContent;

    @Column(name = "last_log_time")
    private String lastLogTime;

    @Column(name = "last_log_id")
    private String lastLogId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private Member receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private Member sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deal_id")
    private Deal deal;

    @OneToMany(mappedBy = "chattingRoom", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<ChattingLog> chattingLogs = new ArrayList<>();

    @Builder
    public DirectChattingRoom(Member receiver, Member sender, Deal deal) {
        this.receiver = receiver;
        this.sender = sender;
        this.deal = deal;
    }

    public void updateLastLog(String lastLogContent, String lastLogTime, String lastLogId) {
        this.lastLogTime = lastLogTime;
        this.lastLogContent = lastLogContent;
        this.lastLogId = lastLogId;
    }

}