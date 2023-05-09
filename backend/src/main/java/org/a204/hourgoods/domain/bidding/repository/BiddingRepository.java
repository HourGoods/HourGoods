package org.a204.hourgoods.domain.bidding.repository;

import java.util.Optional;

import org.a204.hourgoods.domain.bidding.entity.Bidding;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BiddingRepository extends JpaRepository<Bidding, Long> {
	Optional<Bidding> findByDealAndBidder(Member member, Deal deal);
}
