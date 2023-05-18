package org.a204.hourgoods.domain.member.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.DealType;
import org.a204.hourgoods.domain.deal.repository.AuctionRepository;
import org.a204.hourgoods.domain.deal.repository.DealQueryDslRepository;
import org.a204.hourgoods.domain.deal.repository.GameAuctionRepository;
import org.a204.hourgoods.domain.deal.repository.SharingRepository;
import org.a204.hourgoods.domain.deal.repository.TradeRepository;
import org.a204.hourgoods.domain.deal.response.DealInfoResponse;
import org.a204.hourgoods.domain.deal.response.DealListResponse;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.entity.MemberDetails;
import org.a204.hourgoods.domain.member.entity.PointHistory;
import org.a204.hourgoods.domain.member.exception.MemberNotFoundException;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.a204.hourgoods.domain.member.repository.PointHistoryRepository;
import org.a204.hourgoods.domain.member.request.UpdateCashPointRequest;
import org.a204.hourgoods.domain.member.response.MyPageMemberInfoResponse;
import org.a204.hourgoods.domain.member.response.PointHistoryInfoResponse;
import org.a204.hourgoods.domain.member.response.PointHistoryListResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyPageService {
	private static final Integer PAGE_SIZE = 10000;
	private final MemberRepository memberRepository;
	private final AuctionRepository auctionRepository;
	private final GameAuctionRepository gameAuctionRepository;
	private final SharingRepository sharingRepository;
	private final TradeRepository tradeRepository;
	private final PointHistoryRepository pointHistoryRepository;
	private final DealQueryDslRepository dealQueryDslRepository;
	private final Pageable pageable = Pageable.ofSize(PAGE_SIZE);

	// 사용자가 북마크한 거래 목록 조회
	public DealListResponse getBookmarkedDealList(MemberDetails memberDetails) {
		final Long lastDealId = -1L;
		// 유효성 체크
		Member member = null;
		if (memberDetails.getMember() != null) {
			member = checkMemberValidation(memberDetails.getMember());
		}
		if (member == null) throw new MemberNotFoundException();

		// 거래 정보 조회
		Slice<Deal> deals = dealQueryDslRepository.searchBookmarkedDealByMember(member, lastDealId, pageable);

		// 정보가 없을 경우 빈 정보 반환
		if (deals.isEmpty()) {
			return DealListResponse.builder()
				.hasNextPage(false)
				.lastDealId(lastDealId)
				.dealInfoList(new ArrayList<>())
				.build();
		}

		return getDealListResponseByDeals(deals);
	}

	// 사용자가 생성한 거래 목록 조회
	public DealListResponse getCreatedDealList(MemberDetails memberDetails) {
		final Long lastDealId = -1L;
		// 유효성 체크
		Member member = null;
		if (memberDetails.getMember() != null) {
			member = checkMemberValidation(memberDetails.getMember());
		}
		if (member == null) throw new MemberNotFoundException();

		// 거래 정보 조회
		Slice<Deal> deals = dealQueryDslRepository.searchDealByHost(member, lastDealId, pageable);

		// 정보가 없을 경우 빈 정보 반환
		if (deals.isEmpty()) {
			return DealListResponse.builder()
				.hasNextPage(false)
				.lastDealId(lastDealId)
				.dealInfoList(new ArrayList<>())
				.build();
		}

		return getDealListResponseByDeals(deals);
	}

	// 사용자가 참여한 거래 목록 조회
	public DealListResponse getAttendedDealList(MemberDetails memberDetails) {
		final Long lastDealId = -1L;
		// 유효성 체크
		Member member = null;
		if (memberDetails.getMember() != null) {
			member = checkMemberValidation(memberDetails.getMember());
		}
		if (member == null) throw new MemberNotFoundException();

		// 거래 정보 조회
		Slice<Deal> deals = dealQueryDslRepository.searchAttendedDealByMember(member, lastDealId, pageable);

		// 정보가 없을 경우 빈 정보 반환
		if (deals.isEmpty()) {
			return DealListResponse.builder()
				.hasNextPage(false)
				.lastDealId(lastDealId)
				.dealInfoList(new ArrayList<>())
				.build();
		}

		return getDealListResponseByDeals(deals);
	}

	// 사용자의 포인트 내역 조회
	public PointHistoryListResponse getPointHistoryList(MemberDetails memberDetails) {
		final long lastPointHistoryId = -1L;
		// 유효성 체크
		Member member = null;
		if (memberDetails.getMember() != null) {
			member = checkMemberValidation(memberDetails.getMember());
		}

		// 회원의 모든 포인트 내역 조회
		List<PointHistory> pointHistoryList = pointHistoryRepository.findAllByMemberOrderByIdDesc(member);
		List<PointHistoryInfoResponse> pointHistoryInfoList = new ArrayList<>(pointHistoryList.size());
		for (PointHistory pointHistory : pointHistoryList) {
			PointHistoryInfoResponse response = PointHistoryInfoResponse.builder()
				.pointHistoryId(pointHistory.getId())
				.description(pointHistory.getDescription())
				.amount(pointHistory.getAmount())
				.usageTime(pointHistory.getUsageTime())
				.build();
			pointHistoryInfoList.add(response);
		}

		Long responsePointHistoryId = lastPointHistoryId;
		if (!pointHistoryInfoList.isEmpty()) {
			responsePointHistoryId = pointHistoryInfoList.get(pointHistoryInfoList.size() - 1).getPointHistoryId();
		}

		return PointHistoryListResponse.builder()
			.pointHistoryInfoList(pointHistoryInfoList)
			.hasNextPage(false)
			.lastPointHistoryId(responsePointHistoryId)
			.build();

		// *
		//    페이징된 리스트를 반환하는 로직
		// *
		// Slice<PointHistory> pointHistories = memberQueryDslRepository.searchPointHistoryByMember(member,
		// 	lastPointHistoryId, pageable);
		// // 정보가 없을 경우 빈 정보 반환
		// if (pointHistories.isEmpty()) {
		// 	return PointHistoryListResponse.builder()
		// 		.hasNextPage(false)
		// 		.lastPointHistoryId(lastPointHistoryId)
		// 		.pointHistoryInfoList(new ArrayList<>())
		// 		.build();
		// }
		//
		// // lastId 저장위한 변수 생성
		// Long lastPointHistoryResponse = null;
		//
		// // 정보가 있을 경우, 거래 정보에 따라 추가 정보 업데이트 후 정보 반환
		// List<PointHistoryInfoResponse> response = new ArrayList<>();
		// for (PointHistory pointHistory : pointHistories) {
		// 	LocalDateTime endTime = null;
		// 	Integer limitation = null;
		// 	Integer price = null;
		//
		// 	// 최종 list 빌드하여 response에 추가
		// 	PointHistoryInfoResponse pointHistoryInfo = PointHistoryInfoResponse.builder()
		// 		.pointHistoryId(pointHistory.getId())
		// 		.description(pointHistory.getDescription())
		// 		.usageTime(pointHistory.getUsageTime())
		// 		.amount(pointHistory.getAmount())
		// 		.build();
		//
		// 	response.add(pointHistoryInfo);
		//
		// 	lastPointHistoryResponse = pointHistory.getId();
		// }
		//
		// return PointHistoryListResponse.builder()
		// 	.hasNextPage(pointHistories.hasNext())
		// 	.lastPointHistoryId(lastPointHistoryResponse)
		// 	.pointHistoryInfoList(response)
		// 	.build();
	}

	// 사용자 포인트 충전
	@Transactional
	public MyPageMemberInfoResponse updateMemberCashPoint(MemberDetails memberDetails, UpdateCashPointRequest request) {
		// 유효성 체크
		Member member = null;
		if (memberDetails.getMember() != null) {
			member = checkMemberValidation(memberDetails.getMember());
		}
		if (member == null) throw new MemberNotFoundException();

		// 포인트 내역 생성
		PointHistory pointHistory = PointHistory.builder()
			.amount(request.getCashPoint())
			.description("카카오페이 충전")
			.usageTime(LocalDateTime.now())
			.member(member)
			.build();
		pointHistoryRepository.save(pointHistory);

		// 포인트 정보 변경
		member.updateCashPoint(request.getCashPoint());

		return MyPageMemberInfoResponse.builder()
			.nickname(member.getNickname())
			.imageUrl(member.getImageUrl())
			.cashPoint(member.getCashPoint())
			.build();
	}

	// 사용자 마이페이지 정보 조회
	public MyPageMemberInfoResponse getMyPageMemberInfo(MemberDetails memberDetails) {
		// 유효성 체크
		Member member = null;
		if (memberDetails.getMember() != null) {
			member = checkMemberValidation(memberDetails.getMember());
		}
		if (member == null) throw new MemberNotFoundException();

		return MyPageMemberInfoResponse.builder()
			.nickname(member.getNickname())
			.imageUrl(member.getImageUrl())
			.cashPoint(member.getCashPoint())
			.build();
	}

	// Deal 리스트를 응답 형태로 바꾸는 메서드
	private DealListResponse getDealListResponseByDeals(Slice<Deal> deals) {

		// lastId 저장위한 변수 생성
		Long lastDealIdResponse = null;

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
				.meetingLocation(deal.getMeetingLocation())
				.endTime(endTime)
				.limitation(limitation)
				.price(price)
				.isBookmarked(null)
				.build();
			response.add(dealInfo);

			lastDealIdResponse = deal.getId();
		}

		return DealListResponse.builder()
			.hasNextPage(deals.hasNext())
			.lastDealId(lastDealIdResponse)
			.dealInfoList(response)
			.build();
	}

	// member nickname validation check
	private Member checkMemberValidation(Member member) {
		return memberRepository.findByEmail(member.getEmail()).orElseThrow(MemberNotFoundException::new);
	}
}
