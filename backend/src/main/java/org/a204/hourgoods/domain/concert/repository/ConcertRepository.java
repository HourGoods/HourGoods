package org.a204.hourgoods.domain.concert.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.a204.hourgoods.domain.concert.entity.Concert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConcertRepository extends JpaRepository<Concert, Long> {
	List<Concert> findAllByStartTimeBetween(LocalDateTime startTime, LocalDateTime endTime);

	List<Concert> findAllByStartTimeBetweenAndTitleContaining(LocalDateTime startTime, LocalDateTime endTime,
		String keyword);
}
