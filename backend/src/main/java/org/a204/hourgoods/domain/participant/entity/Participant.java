package org.a204.hourgoods.domain.participant.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.global.common.BaseTime;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity
@Table(name = "participant")
public class Participant extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "ranking")
    private Integer ranking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deal_id")
    private Deal deal;

}