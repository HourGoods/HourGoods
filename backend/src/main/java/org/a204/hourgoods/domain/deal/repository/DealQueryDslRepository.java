package org.a204.hourgoods.domain.deal.repository;

import java.util.List;

import javax.persistence.EntityManager;

import org.a204.hourgoods.domain.concert.entity.QConcert;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.entity.QDeal;
import org.a204.hourgoods.domain.deal.request.ConcertDealListRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

@Repository
public class DealQueryDslRepository {

	private final JPAQueryFactory query;

	public DealQueryDslRepository(EntityManager em) {
		this.query = new JPAQueryFactory(em);
	}

	QDeal deal = QDeal.deal;
	QConcert concert = QConcert.concert;

	public Slice<Deal> searchByConcert(ConcertDealListRequest request, Pageable pageable) {
		List<Deal> results = query.selectFrom(deal)
			.join(deal.concert, concert)
			.fetchJoin()
			.where(
				checkDealType(request.getDealTypeName()),
				checkLastDealId(request.getLastDealId()),
				deal.concert.id.eq(request.getConcertId()),
				deal.status.isTrue()
			)
			.orderBy(deal.id.desc())
			.limit(pageable.getPageSize() + 1L)
			.fetch();
		return checkLastPage(pageable, results);
	}

	// 거래 종류 필터하는 메소드
	private BooleanExpression checkDealType(String dealTypeName) {
		if (dealTypeName.equals("All")) {
			return null;
		}
		return deal.dealType.eq(DealType.valueOf(dealTypeName));
	}

	// no-offset 방식을 처리하는 메소드 (storeId가 -1일 경우, 있을 경우)
	private BooleanExpression checkLastDealId(Long lastDealId) {
		if (lastDealId == -1L) {
			return null;
		}
		return deal.id.lt(lastDealId);
	}

	// 무한스크롤을 위해 다음 페이지에 정보가 있는지 없는지 전달할 메소드
	private Slice<Deal> checkLastPage(Pageable pageable, List<Deal> results) {
		boolean hasNext = false;

		// 조회한 결과 개수가 요청한 페이지 사이즈보다 크면 뒤에 더 있음
		if (results.size() > pageable.getPageSize()) {
			hasNext = true;
			results.remove(pageable.getPageSize());
		}
		return new SliceImpl<>(results, pageable, hasNext);

	}

}
