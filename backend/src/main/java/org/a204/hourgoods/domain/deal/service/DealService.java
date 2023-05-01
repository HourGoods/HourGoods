package org.a204.hourgoods.domain.deal.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;

import org.a204.hourgoods.domain.concert.entity.Concert;
import org.a204.hourgoods.domain.concert.exception.ConcertNotFoundException;
import org.a204.hourgoods.domain.concert.repository.ConcertRepository;
import org.a204.hourgoods.domain.deal.entity.Auction;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.entity.GameAuction;
import org.a204.hourgoods.domain.deal.entity.Sharing;
import org.a204.hourgoods.domain.deal.entity.Trade;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.exception.DealTypeNotFoundException;
import org.a204.hourgoods.domain.deal.exception.MemberMissMatchException;
import org.a204.hourgoods.domain.deal.repository.AuctionRepository;
import org.a204.hourgoods.domain.deal.repository.DealQueryDslRepository;
import org.a204.hourgoods.domain.deal.repository.DealRepository;
import org.a204.hourgoods.domain.deal.repository.GameAuctionRepository;
import org.a204.hourgoods.domain.deal.repository.SharingRepository;
import org.a204.hourgoods.domain.deal.repository.TradeRepository;
import org.a204.hourgoods.domain.deal.request.ConcertDealListRequest;
import org.a204.hourgoods.domain.deal.request.DealCreateRequest;
import org.a204.hourgoods.domain.deal.response.ConcertDealListResponse;
import org.a204.hourgoods.domain.deal.response.DealCreateResponse;
import org.a204.hourgoods.domain.deal.response.DealDetailResponse;
import org.a204.hourgoods.domain.deal.response.DealInfoResponse;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.exception.MemberNotFoundException;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
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
	private final MemberRepository memberRepository;
	private final DealRepository dealRepository;

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
			} else if (dealType.equals(DealType.HourAuction)) {
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

	@Transactional(readOnly = true)
	public DealDetailResponse getDealDetail(Long dealId) {
		Deal deal = dealQueryDslRepository.searchDealById(dealId);

		Integer minPrice = null;
		LocalDateTime endTime = null;
		Integer limitation = null;
		Integer price = null;

		// 딜 타입에 따라 repository 재탐색
		DealType dealType = deal.getDealType();
		if (dealType.equals(DealType.Auction)) {
			Auction auction = auctionRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
			minPrice = auction.getMinimumPrice();
			endTime = auction.getEndTime();
		} else if (dealType.equals(DealType.HourAuction)) {
			GameAuction gameAuction = gameAuctionRepository.findById(dealId)
				.orElseThrow(DealNotFoundException::new);
			minPrice = gameAuction.getMinimumPrice();
			endTime = gameAuction.getEndTime();
		} else if (dealType.equals(DealType.Sharing)) {
			limitation = sharingRepository.findLimitationById(deal.getId());
		} else if (dealType.equals(DealType.Trade)) {
			price = tradeRepository.findPriceById(deal.getId());
		}

		// 종합하여 response 생성하여 반환
		return DealDetailResponse.builder()
			.dealTitle(deal.getTitle())
			.dealImageUrl(deal.getImageUrl())
			.dealContent(deal.getContent())
			.dealLongitude(deal.getLongitude())
			.dealLatitude(deal.getLatitude())
			.dealType(deal.getDealType().toString())
			.userImageUrl(deal.getDealHost().getImageUrl())
			.userNickname(deal.getDealHost().getNickname())
			.startTime(deal.getStartTime())
			.concertTitle(deal.getConcert().getTitle())
			.minPrice(minPrice)
			.endTime(endTime)
			.price(price)
			.limit(limitation).build();
	}

	@Transactional
	public DealCreateResponse createDeal(DealCreateRequest dealCreateRequest) {
		String dealType = dealCreateRequest.getDealType();
		Member member = memberRepository.findById(dealCreateRequest.getMemberId()).orElseThrow(MemberNotFoundException::new);
		Concert concert = concertRepository.findById(dealCreateRequest.getConcertId()).orElseThrow(ConcertNotFoundException::new);
		Long dealId;
		if (String.valueOf(DealType.Auction).equals(dealType)) {
			Auction auction = Auction.auctionBuilder()
				.imageUrl(dealCreateRequest.getImageUrl())
				.title(dealCreateRequest.getTitle())
				.content(dealCreateRequest.getContent())
				.startTime(dealCreateRequest.getStartTime())
				.longitude(dealCreateRequest.getLongitude())
				.latitude(dealCreateRequest.getLatitude())
				.dealHost(member)
				.concert(concert)
				.minimumPrice(dealCreateRequest.getMinimumPrice())
				.finalPrice(dealCreateRequest.getFinalPrice())
				.endTime(dealCreateRequest.getEndTime()).build();
			auctionRepository.save(auction);
			dealId = auction.getId();
		} else if (String.valueOf(DealType.HourAuction).equals(dealType)) {
			GameAuction gameAuction = GameAuction.gameAuctionBuilder()
				.imageUrl(dealCreateRequest.getImageUrl())
				.title(dealCreateRequest.getTitle())
				.content(dealCreateRequest.getContent())
				.startTime(dealCreateRequest.getStartTime())
				.longitude(dealCreateRequest.getLongitude())
				.latitude(dealCreateRequest.getLatitude())
				.dealHost(member)
				.concert(concert)
				.minimumPrice(dealCreateRequest.getMinimumPrice())
				.finalPrice(dealCreateRequest.getFinalPrice())
				.endTime(dealCreateRequest.getEndTime()).build();
			gameAuctionRepository.save(gameAuction);
			dealId = gameAuction.getId();
		} else if (String.valueOf(DealType.Trade).equals(dealType)) {
			Trade trade = Trade.tradeBuilder()
				.imageUrl(dealCreateRequest.getImageUrl())
				.title(dealCreateRequest.getTitle())
				.content(dealCreateRequest.getContent())
				.startTime(dealCreateRequest.getStartTime())
				.longitude(dealCreateRequest.getLongitude())
				.latitude(dealCreateRequest.getLatitude())
				.dealHost(member)
				.concert(concert)
				.price(dealCreateRequest.getPrice()).build();
			tradeRepository.save(trade);
			dealId = trade.getId();
		} else if (String.valueOf(DealType.Sharing).equals(dealType)) {
			Sharing sharing = Sharing.sharingBuilder()
				.imageUrl(dealCreateRequest.getImageUrl())
				.title(dealCreateRequest.getTitle())
				.content(dealCreateRequest.getContent())
				.startTime(dealCreateRequest.getStartTime())
				.longitude(dealCreateRequest.getLongitude())
				.latitude(dealCreateRequest.getLatitude())
				.dealHost(member)
				.concert(concert)
				.limitation(dealCreateRequest.getLimit()).build();
			sharingRepository.save(sharing);
			dealId = sharing.getId();
		} else
			throw new DealTypeNotFoundException();
		return DealCreateResponse.builder().dealId(dealId).build();
	}

	@Transactional
	public Boolean deleteDeal(Long memberId, Long dealId) {
		Deal deal = dealRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
		if (memberId != deal.getDealHost().getId()) throw new MemberMissMatchException();
		dealRepository.deleteById(dealId);
		return true;
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
