package org.a204.hourgoods.domain.deal.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;

@Getter
@NoArgsConstructor
@Entity
public class Sharing extends Deal {
    @Column(name = "limit")
    private Integer limit;
}
