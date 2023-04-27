package org.a204.hourgoods.domain.deal.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;

import org.a204.hourgoods.domain.concert.exception.ConcertNotFoundException;
import org.a204.hourgoods.domain.concert.repository.ConcertRepository;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.exception.DealTypeNotFoundException;
import org.a204.hourgoods.domain.deal.repository.AuctionRepository;
import org.a204.hourgoods.domain.deal.repository.DealQueryDslRepository;
import org.a204.hourgoods.domain.deal.repository.GameAuctionRepository;
import org.a204.hourgoods.domain.deal.repository.SharingRepository;
import org.a204.hourgoods.domain.deal.repository.TradeRepository;
import org.a204.hourgoods.domain.deal.request.ConcertDealListRequest;
import org.a204.hourgoods.domain.deal.response.ConcertDealListResponse;
import org.a204.hourgoods.domain.deal.response.DealInfoResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DealService {

	private final DealQueryDslRepository dealQueryDslRepository;
	private final AuctionRepository auctionRepository;
	private final GameAuctionRepository gameAuctionRepository;
	private final SharingRepository sharingRepository;
	private final TradeRepository tradeRepository;
	private final ConcertRepository concertRepository;

	private static final Integer PAGE_SIZE = 10;

	@Transactional(readOnly = true)
	public ConcertDealListResponse getDealListByConcert(ConcertDealListRequest request) {
		// 유효성 체크
		checkConcertValidation(request.getConcertId());
		checkDealTypeValidation(request.getDealTypeName());

		// 거래 정보 조회
		Pageable pageable = Pageable.ofSize(PAGE_SIZE);
		Slice<Deal> deals = dealQueryDslRepository.searchDealByCond(request, pageable);

		// 정보가 없을 경우 빈 정보 반환
		if (deals.isEmpty()) {
			return ConcertDealListResponse.builder()
				.hasNextPage(false)
				.lastDealId(request.getLastDealId())
				.dealInfoList(new ArrayList<>())
				.build();
		}
		// lastId 저장위한 변수 생성
		Long lastDealId = null;

		// 정보가 있을 경우, 거래 정보에 따라 추가 정보 업데이트 후 정보 반환
		List<DealInfoResponse> response = new ArrayList<>();
		for (Deal deal : deals) {
			LocalDateTime endTime = null;
			Integer limitation = null;
			Integer price = null;

			// 딜 타입에 따라 repository 재탐색
			DealType dealType = deal.getDealType();
			if (dealType.equals(DealType.Auction)) {
				endTime = auctionRepository.findEndTimeById(deal.getId());
			} else if (dealType.equals(DealType.GameAuction)) {
				endTime = gameAuctionRepository.findEndTimeById(deal.getId());
			} else if (dealType.equals(DealType.Sharing)) {
				limitation = sharingRepository.findLimitationById(deal.getId());
			} else if (dealType.equals(DealType.Trade)) {
				price = tradeRepository.findPriceById(deal.getId());
			}

			// 최종 list 빌드하여 response에 추가
			DealInfoResponse dealInfo = DealInfoResponse.builder()
				.dealId(deal.getId())
				.dealTypeName(deal.getDealType().toString())
				.imageUrl(deal.getImageUrl())
				.title(deal.getTitle())
				.startTime(deal.getStartTime())
				.endTime(endTime)
				.limitation(limitation)
				.price(price)
				.build();
			response.add(dealInfo);

			lastDealId = deal.getId();
		}

		return ConcertDealListResponse.builder()
			.hasNextPage(deals.hasNext())
			.lastDealId(lastDealId)
			.dealInfoList(response)
			.build();

	}

	// concert id validation check
	private void checkConcertValidation(Long concertId) {
		if (!concertRepository.existsById(concertId)) {
			throw new ConcertNotFoundException();
		}
	}

	// deal type validation check
	private void checkDealTypeValidation(String dealTypeName) {
		try {
			DealType.valueOf(dealTypeName);
		} catch (IllegalArgumentException e) {
			throw new DealTypeNotFoundException();
		}
	}
}
