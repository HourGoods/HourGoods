package org.a204.hourgoods.domain.member.repository;

import org.a204.hourgoods.domain.member.entity.PointHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointHistoryRepository extends JpaRepository<PointHistory, Long> {

}
