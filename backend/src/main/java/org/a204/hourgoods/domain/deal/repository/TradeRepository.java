package org.a204.hourgoods.domain.deal.repository;

import org.a204.hourgoods.domain.deal.entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TradeRepository extends JpaRepository<Trade, Long> {

	@Query("Select t.price FROM Trade t Where t.id = :id")
	Integer findPriceById(@Param("id") Long id);

}
