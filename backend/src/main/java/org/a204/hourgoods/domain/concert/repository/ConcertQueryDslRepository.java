package org.a204.hourgoods.domain.concert.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.EntityManager;

import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.concert.entity.QConcert;
import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

@Repository
public class ConcertQueryDslRepository {

	private final JPAQueryFactory query;

	public ConcertQueryDslRepository(EntityManager em) {
		this.query = new JPAQueryFactory((em));
	}

	QConcert concert = QConcert.concert;

	public List<String> searchAllKopisConcertIdByPeriod(LocalDateTime startTime, LocalDateTime endTime) {
		List<String> results = query.select(concert.kopisConcertId)
			.from(concert)
			.where(
				concert.startTime.between(startTime, endTime)
			)
			.fetch();
		return results;
	}

	public List<Concert> searchAllConcertByPeriodAndKeyword(LocalDateTime startTime, LocalDateTime endTime,
		String keyword) {
		List<Concert> results = query.selectFrom(concert)
			.where(
				concert.startTime.between(startTime, endTime),
				concert.title.contains(keyword)
			)
			.orderBy(concert.startTime.asc())
			.fetch();
		return results;
	}

	public List<Concert> searchConcertByDate(LocalDate date) {
		List<Concert> results = query.selectFrom(concert)
			.where(
				concert.startTime.between(date.atStartOfDay(), date.plusDays(1).atStartOfDay().minusSeconds(1))
			)
			.fetch();
		return results;
	}

}
