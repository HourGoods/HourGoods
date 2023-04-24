package org.a204.hourgoods.domain.transaction.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.global.common.BaseTime;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "transaction")
public class Transaction extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "status")
    private Integer status;

    @Column(name = "done_time")
    private LocalDateTime doneTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchaser_id")
    private Member purchaser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deal_id")
    private Deal deal;

}