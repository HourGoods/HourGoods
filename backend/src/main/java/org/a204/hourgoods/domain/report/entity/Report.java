package org.a204.hourgoods.domain.report.entity;

import lombok.Getter;
import org.a204.hourgoods.domain.member.entity.Member;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "report")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "category")
    private Integer category;

    @Column(name = "content")
    private String content;

    @Column(name = "report_time")
    private LocalDateTime reportTime;

    @Column(name = "status")
    private Boolean status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_member_id")
    private Member reporterMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_member_id")
    private Member reportedMember;

}