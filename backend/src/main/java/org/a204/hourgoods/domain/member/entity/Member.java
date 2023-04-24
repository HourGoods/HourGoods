package org.a204.hourgoods.domain.member.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a204.hourgoods.domain.chatting.entity.ChattingLog;
import org.a204.hourgoods.domain.chatting.entity.ChattingRoom;
import org.a204.hourgoods.domain.concert.entity.ConcertBookmark;
import org.a204.hourgoods.domain.deal.entity.DealBookmark;
import org.a204.hourgoods.domain.participant.entity.Participant;
import org.a204.hourgoods.domain.report.entity.Report;
import org.a204.hourgoods.domain.transaction.entity.Transaction;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "member")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "nickname", length = 50)
    private String nickname;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "cash_point")
    private Integer cashPoint;

    @Column(name = "status")
    private Integer status;

    // 신고한 목록
    @OneToMany(mappedBy = "reporterMember", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<Report> reportList = new ArrayList<>();

    // 신고 당한 목록
    @OneToMany(mappedBy = "reportedMember", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<Report> reportedList = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<ConcertBookmark> concertBookmarks = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<DealBookmark> dealBookmarks = new ArrayList<>();

    @OneToMany(mappedBy = "lowerMember", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<ChattingRoom> lowerMemberChattingList = new ArrayList<>();

    @OneToMany(mappedBy = "higherMember", orphanRemoval = true)
    private List<ChattingRoom> higherMemberChattingList = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<ChattingLog> chattingLogs = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<PointHistory> pointHistories = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<Participant> participants = new ArrayList<>();

    @OneToMany(mappedBy = "purchaser", cascade = CascadeType.PERSIST, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();

}