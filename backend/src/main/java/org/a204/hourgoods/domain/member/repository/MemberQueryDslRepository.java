package org.a204.hourgoods.domain.member.repository;

import java.util.List;

import javax.persistence.EntityManager;

import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.PointHistory;
import org.a204.hourgoods.domain.member.entity.QMember;
import org.a204.hourgoods.domain.member.entity.QPointHistory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;

@Repository
public class MemberQueryDslRepository {
	private final JPAQueryFactory query;
	QMember member = QMember.member;
	QPointHistory pointHistory = QPointHistory.pointHistory;

	public MemberQueryDslRepository(EntityManager em) {
		this.query = new JPAQueryFactory(em);
	}

	// 사용자의 포인트 내역 조회
	public Slice<PointHistory> searchPointHistoryByMember(Member member, Long lastPointHistoryId, Pageable pageable) {
		List<PointHistory> results = query.selectFrom(pointHistory)
			.where(
				pointHistory.member.id.eq(member.getId()),
				checkLastPointHistoryId(lastPointHistoryId)
			)
			.orderBy(pointHistory.usageTime.desc())
			.limit(pageable.getPageSize() + 1L)
			.fetch();
		return checkLastPage(pageable, results);
	}

	// no-offset 방식을 처리하는 메소드 (storeId가 -1일 경우, 있을 경우)
	private BooleanExpression checkLastPointHistoryId(Long lastPointHistoryId) {
		if (lastPointHistoryId == -1L) {
			return null;
		}
		return pointHistory.id.lt(lastPointHistoryId);
	}

	// 무한스크롤을 위해 다음 페이지에 정보가 있는지 없는지 전달할 메소드
	private Slice<PointHistory> checkLastPage(Pageable pageable, List<PointHistory> results) {
		boolean hasNext = false;

		// 조회한 결과 개수가 요청한 페이지 사이즈보다 크면 뒤에 더 있음
		if (results.size() > pageable.getPageSize()) {
			hasNext = true;
			results.remove(pageable.getPageSize());
		}
		return new SliceImpl<>(results, pageable, hasNext);

	}
}
