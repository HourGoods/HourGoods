package org.a204.hourgoods.domain.deal.repository;

import javax.persistence.EntityManager;

import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.QDeal;
import org.a204.hourgoods.domain.deal.entity.QDealBookmark;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.QMember;
import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

@Repository
public class BookmarkQueryDslRepository {
	private final JPAQueryFactory query;
	public BookmarkQueryDslRepository(EntityManager em) {
		this.query = new JPAQueryFactory(em);
	}

	QDeal deal = QDeal.deal;
	QMember member = QMember.member;
	QDealBookmark bookmark = QDealBookmark.dealBookmark;

	public Boolean deleteBookmarkByMemberAndDeal(Member member, Deal deal) {
		long count = query.delete(bookmark)
			.where(bookmark.deal.eq(deal),
				bookmark.member.eq(member))
			.execute();
		return count != 0;
	}
}
