package org.a204.hourgoods.domain.deal.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a204.hourgoods.domain.member.entity.Member;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "deal_bookmark")
public class DealBookmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deal_id")
    private Deal deal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Builder
    public DealBookmark(Deal deal, Member member) {
        this.deal = deal;
        this.member = member;
    }
}