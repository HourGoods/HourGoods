package org.a204.hourgoods.domain.concert.repository;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.EntityManager;

import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.concert.entity.QConcert;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

@Repository
public class ConcertQueryDslRepository {

	private final JPAQueryFactory query;

	public ConcertQueryDslRepository(EntityManager em) {
		this.query = new JPAQueryFactory((em));
	}

	QConcert concert = QConcert.concert;

	public List<String> searchAllKopisConcertId() {
		List<String> results = query.select(concert.kopisConcertId)
			.from(concert)
			.fetch();
		return results;
	}

	public Slice<Concert> searchAllConcertByPeriodAndKeyword(LocalDateTime startTime, LocalDateTime endTime,
		String keyword, Long lastConcertId, LocalDateTime lastConcertStartTime, Integer lastConcertDealsSize,
		Pageable pageable) {
		List<Concert> results = query.selectFrom(concert)
			.where(
				concert.startTime.between(startTime, endTime),
				concert.title.containsIgnoreCase(keyword),
				checkLastConcertId(lastConcertId, lastConcertStartTime, lastConcertDealsSize)
			)
			.orderBy(
				concert.deals.size().desc(),
				concert.startTime.asc(),
				concert.id.asc()
			)
			.limit(pageable.getPageSize() + 1L)
			.fetch();
		return checkLastPage(pageable, results);
	}

	public List<Concert> searchAllConcertByPeriod(LocalDateTime startTime, LocalDateTime endTime) {
		List<Concert> results = query.selectFrom(concert)
			.where(
				concert.startTime.between(startTime, endTime)
			)
			.fetch();
		return results;
	}

	// no-offset 방식을 처리하는 메소드 (storeId가 -1일 경우, 있을 경우)
	private BooleanExpression checkLastConcertId(Long lastConcertId, LocalDateTime lastConcertStartTime,
		Integer lastConcertDealsSize) {
		if (lastConcertId == -1L) {
			return null;
		}

		return concert.deals.size().eq(lastConcertDealsSize).and(concert.startTime.eq(lastConcertStartTime).and(concert.id.gt(lastConcertId)))
			.or(concert.deals.size().eq(lastConcertDealsSize).and(concert.startTime.after(lastConcertStartTime)))
			.or(concert.deals.size().lt(lastConcertDealsSize));
	}

	// 무한스크롤을 위해 다음 페이지에 정보가 있는지 없는지 전달할 메소드
	private Slice<Concert> checkLastPage(Pageable pageable, List<Concert> results) {
		boolean hasNext = false;

		// 조회한 결과 개수가 요청한 페이지 사이즈보다 크면 뒤에 더 있음
		if (results.size() > pageable.getPageSize()) {
			hasNext = true;
			results.remove(pageable.getPageSize());
		}
		return new SliceImpl<>(results, pageable, hasNext);

	}

}
