package org.a204.hourgoods.domain.deal.repository;

import java.util.Optional;

import org.a204.hourgoods.domain.deal.entity.TradeLocation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TradeLocationRepository extends CrudRepository<TradeLocation, String> {
	Boolean existsByDealIdAndSellerIdAndPurchaserId(String dealId, String sellerId, String purchaserId);

	Optional<TradeLocation> findByDealIdAndSellerIdAndPurchaserId(String dealId, String sellerId, String purchaserId);
}
