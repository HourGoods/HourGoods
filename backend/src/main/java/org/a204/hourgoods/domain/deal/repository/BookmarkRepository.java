package org.a204.hourgoods.domain.deal.repository;

import org.a204.hourgoods.domain.deal.entity.DealBookmark;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkRepository extends JpaRepository<DealBookmark, Long> {
}
