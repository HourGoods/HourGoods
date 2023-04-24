package org.a204.hourgoods.domain.concert.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a204.hourgoods.domain.member.entity.Member;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "concert_bookmark")
public class ConcertBookmark {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concert_id")
    private Concert concert;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

}