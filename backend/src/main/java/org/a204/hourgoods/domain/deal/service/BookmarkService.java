package org.a204.hourgoods.domain.deal.service;

import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.DealBookmark;
import org.a204.hourgoods.domain.deal.exception.BookmarkNotFoundException;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.repository.BookmarkQueryDslRepository;
import org.a204.hourgoods.domain.deal.repository.BookmarkRepository;
import org.a204.hourgoods.domain.deal.repository.DealRepository;
import org.a204.hourgoods.domain.member.entity.Member;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookmarkService {
	private final DealRepository dealRepository;
	private final BookmarkRepository bookmarkRepository;
	private final BookmarkQueryDslRepository bookmarkQueryDslRepository;

	@Transactional
	public Boolean registBookmark(Long dealId, Member member) {
		Deal deal = dealRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
		DealBookmark bookmark = DealBookmark.builder()
			.deal(deal)
			.member(member).build();
		bookmarkRepository.save(bookmark);
		return true;
	}

	@Transactional
	public Boolean cancelBookmark(Long dealId, Member member) {
		Deal deal = dealRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
		if (!bookmarkQueryDslRepository.deleteBookmarkByMemberAndDeal(member, deal)) {
			throw new BookmarkNotFoundException();
		}
		return true;
	}

	@Transactional(readOnly = true)
	public Boolean checkBookmark(Member member, Long dealId) {
		Deal deal = dealRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
		return bookmarkRepository.existsByMemberAndDeal(member, deal);
	}
}
