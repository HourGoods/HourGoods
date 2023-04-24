package org.a204.hourgoods.domain.deal.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
public class Auction extends Deal {
    @Column(name = "minimum_price")
    private Integer minimumPrice;

    @Column(name = "final_price")
    private Integer finalPrice;

    @Column(name = "end_time")
    private LocalDateTime endTime;

}