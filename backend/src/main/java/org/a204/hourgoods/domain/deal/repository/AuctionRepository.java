package org.a204.hourgoods.domain.deal.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.a204.hourgoods.domain.deal.entity.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuctionRepository extends JpaRepository<Auction, Long> {

	@Query("Select a.endTime FROM Auction a Where a.id = :id")
	LocalDateTime findEndTimeById(@Param("id") Long id);

	@Query("select a from Auction a join fetch a.winner where a.id = :auctionId")
	Optional<Auction> findByIdWithWinner(@Param("auctionId") Long auctionId);
}
