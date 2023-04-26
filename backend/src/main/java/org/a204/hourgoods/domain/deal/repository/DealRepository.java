package org.a204.hourgoods.domain.deal.repository;

import org.a204.hourgoods.domain.deal.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DealRepository extends JpaRepository<Deal, Long> {

}
