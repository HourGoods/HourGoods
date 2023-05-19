package org.a204.hourgoods.domain.deal.repository;

import java.time.LocalDateTime;

import org.a204.hourgoods.domain.deal.entity.GameAuction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GameAuctionRepository extends JpaRepository<GameAuction, Long> {

	@Query("Select ga.endTime FROM GameAuction ga Where ga.id = :id")
	LocalDateTime findEndTimeById(@Param("id") Long id);

}
