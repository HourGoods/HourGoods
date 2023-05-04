package org.a204.hourgoods.domain.deal.repository;

import java.util.List;

import javax.persistence.EntityManager;

import org.a204.hourgoods.domain.concert.entity.QConcert;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.QDeal;
import org.a204.hourgoods.domain.deal.entity.QDealBookmark;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.request.ConcertDealListRequest;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.QMember;
import org.a204.hourgoods.domain.participant.entity.QParticipant;
import org.a204.hourgoods.domain.transaction.entity.QTransaction;
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
	QMember member = QMember.member;
	QDealBookmark dealBookmark = QDealBookmark.dealBookmark;
	QTransaction transaction = QTransaction.transaction;
	QParticipant participant = QParticipant.participant;

	public Slice<Deal> searchDealByCond(ConcertDealListRequest request, Pageable pageable) {
		List<Deal> results = query.selectFrom(deal)
			.join(deal.concert, concert)
			.fetchJoin()
			.where(
				deal.concert.id.eq(request.getConcertId()),
				checkLastDealId(request.getLastDealId()),
				checkDealType(request.getDealTypeName()),
				checkSearchKeyword(request.getSearchKeyword()),
				deal.isAvailable.isTrue()
			)
			.orderBy(deal.id.desc())
			.limit(pageable.getPageSize() + 1L)
			.fetch();
		return checkLastPage(pageable, results);
	}

	// 사용자가 북마크한 거래 목록 조회
	public Slice<Deal> searchBookmarkedDealByMember(Member member, Long lastDealId, Pageable pageable) {
		List<Deal> results = query.select(dealBookmark.deal)
			.from(dealBookmark)
			.where(
				dealBookmark.member.id.eq(member.getId()),
				checkLastDealId(lastDealId)
			)
			.orderBy(dealBookmark.deal.startTime.desc())
			.limit(pageable.getPageSize() + 1L)
			.fetch();
		return checkLastPage(pageable, results);
	}

	// 사용자가 생성한 거래 목록 조회
	public Slice<Deal> searchDealByHost(Member host, Long lastDealId, Pageable pageable) {
		List<Deal> results = query.selectFrom(deal)
			.where(
				deal.dealHost.id.eq(host.getId()),
				checkLastDealId(lastDealId)
			)
			.orderBy(deal.startTime.desc())
			.limit(pageable.getPageSize() + 1L)
			.fetch();
		return checkLastPage(pageable, results);
	}

	// 사용자가 참여한 거래 목록 조회
	public Slice<Deal> searchAttendedDealByMember(Member member, Long lastDealId, Pageable pageable) {
		List<Deal> results = query.selectFrom(deal)
			.innerJoin(transaction.deal, deal)
			.leftJoin(participant.deal, deal)
			.fetchJoin()
			.where(
				transaction.purchaser.id.eq(member.getId()),
				checkLastDealId(lastDealId)
			)
			.orderBy(deal.startTime.desc())
			.limit(pageable.getPageSize() + 1L)
			.fetch();
		return checkLastPage(pageable, results);
	}

	// 거래 종류 필터하는 메소드
	private BooleanExpression checkDealType(String dealTypeName) {
		if (dealTypeName.equals("All")) {
			return null;
		}
		return deal.dealType.stringValue().eq(dealTypeName);
	}

	// no-offset 방식을 처리하는 메소드 (storeId가 -1일 경우, 있을 경우)
	private BooleanExpression checkLastDealId(Long lastDealId) {
		if (lastDealId == -1L) {
			return null;
		}
		return deal.id.lt(lastDealId);
	}

	// 키워드를 처리하는 메소드
	private BooleanExpression checkSearchKeyword(String searchKeyword) {
		if (searchKeyword == null) {
			return null;
		}
		return deal.title.contains(searchKeyword);
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

	public Deal searchDealById(Long dealId) {
		List<Deal> result = query.selectFrom(deal)
			.join(deal.concert, concert)
			.join(deal.dealHost, member)
			.fetchJoin()
			.where(deal.id.eq(dealId))
			.fetch();
		if (result.isEmpty())
			throw new DealNotFoundException();
		return result.get(0);
	}
}
