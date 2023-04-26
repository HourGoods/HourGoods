package org.a204.hourgoods.domain.deal.repository;

import org.a204.hourgoods.domain.deal.entity.Sharing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SharingRepository extends JpaRepository<Sharing, Long> {
	@Query("Select s.limitation FROM Sharing s Where s.id = :id")
	Integer findLimitationById(@Param("id") Long id);

}
