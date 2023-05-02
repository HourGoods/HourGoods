package org.a204.hourgoods.domain.deal.repository;

import java.time.LocalDateTime;

import javax.persistence.EntityManager;

import org.a204.hourgoods.CustomSpringBootTest;
import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.deal.entity.Auction;
import org.a204.hourgoods.domain.deal.entity.DealBookmark;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.member.entity.Member;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

@CustomSpringBootTest
@Transactional
class BookmarkRepositoryTest {
	@Autowired
	EntityManager em;
	@Autowired
	BookmarkRepository bookmarkRepository;
	@Test
	@DisplayName("북마크 여부 확인 메소드")
	void bookmarkCheck() throws Exception {
		// given
		Member member = Member.builder()
			.email("johan@hourgoods.com")
			.imageUrl("https://shorturl.at/bix17")
			.nickname("americaRabbit").build();
		Concert concert = Concert.builder().build();
		Auction auction = Auction.auctionBuilder()
			.title("포카경매합니다")
			.dealType(DealType.Auction)
			.isAvaliable(true)
			.startTime(LocalDateTime.now().plusHours(5))
			.endTime(LocalDateTime.now().plusHours(8))
			.minimumPrice(10_000)
			.concert(concert)
			.dealHost(member)
			.build();
		DealBookmark bookmark = DealBookmark.builder()
				.member(member)
					.deal(auction).build();
		em.persist(member);
		em.persist(concert);
		em.persist(auction);
		em.persist(bookmark);
		em.flush();
		em.clear();
		// when
		Boolean isBookmarked = bookmarkRepository.existsByMemberAndDeal(member, auction);
		// then
		Assertions.assertEquals(isBookmarked, true);
	}
}