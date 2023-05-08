package org.a204.hourgoods.domain.bidding.repository;

import org.a204.hourgoods.domain.bidding.entity.Bidding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BiddingRepository extends JpaRepository<Bidding, Long> {
}
