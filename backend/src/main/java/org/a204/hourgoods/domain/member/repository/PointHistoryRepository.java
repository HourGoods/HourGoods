package org.a204.hourgoods.domain.member.repository;

import java.util.List;

import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.PointHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointHistoryRepository extends JpaRepository<PointHistory, Long> {
	List<PointHistory> findAllByMemberOrderByIdDesc(Member member);
}
