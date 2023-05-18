package org.a204.hourgoods.domain.deal.service;

import org.a204.hourgoods.domain.chatting.entity.DirectChattingRoom;
import org.a204.hourgoods.domain.chatting.exception.DirectChattingRoomNotFoundException;
import org.a204.hourgoods.domain.chatting.repository.DirectChattingRoomRepository;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.entity.Trade;
import org.a204.hourgoods.domain.deal.entity.TradeLocation;
import org.a204.hourgoods.domain.deal.exception.DealClosedException;
import org.a204.hourgoods.domain.deal.exception.NotEnoughCashPointException;
import org.a204.hourgoods.domain.deal.exception.PurchaserNotFoundException;
import org.a204.hourgoods.domain.deal.exception.SellerNotFoundException;
import org.a204.hourgoods.domain.deal.exception.SellerNotValidException;
import org.a204.hourgoods.domain.deal.exception.TradeLocationNotFoundException;
import org.a204.hourgoods.domain.deal.exception.TradeNotFoundException;
import org.a204.hourgoods.domain.deal.repository.TradeLocationRepository;
import org.a204.hourgoods.domain.deal.repository.TradeRepository;
import org.a204.hourgoods.domain.deal.request.CreateTradeLocationRequest;
import org.a204.hourgoods.domain.deal.request.DoneMessageRequest;
import org.a204.hourgoods.domain.deal.request.TradeMessageRequest;
import org.a204.hourgoods.domain.deal.response.CreateTradeLocationResponse;
import org.a204.hourgoods.domain.deal.response.LocationInfoResponse;
import org.a204.hourgoods.domain.deal.response.TradeMessageResponse;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.exception.MemberNotFoundException;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.a204.hourgoods.global.util.CheckDistanceUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TradeService {
	private final MemberRepository memberRepository;
	private final TradeRepository tradeRepository;
	private final TradeLocationRepository tradeLocationRepository;
	private final DirectChattingRoomRepository directChattingRoomRepository;

	public CreateTradeLocationResponse createTradeLocation(CreateTradeLocationRequest request) {
		// 유효성 검사
		DirectChattingRoom directChattingRoom = directChattingRoomRepository.findById(request.getChattingRoomId())
			.orElseThrow(
				DirectChattingRoomNotFoundException::new);
		Trade trade = tradeRepository.findById(directChattingRoom.getDeal().getId())
			.orElseThrow(TradeNotFoundException::new);
		Member seller = directChattingRoom.getReceiver();
		Member purchaser = directChattingRoom.getSender();
		isEqualDealHostAndSeller(trade, seller);

		// 없으면 생성
		String tradeLocationId = "";
		if (!checkAlreadyExistedTradeLocation(trade.getId(), seller.getId(), purchaser.getId())) {
			TradeLocation tradeLocation = TradeLocation.builder()
				.dealId(trade.getId().toString())
				.sellerId(seller.getId().toString())
				.purchaserId(purchaser.getId().toString())
				.build();
			tradeLocationId = tradeLocationRepository.save(tradeLocation).getId();
		} else {
			TradeLocation tradeLocation = tradeLocationRepository.findByDealIdAndSellerIdAndPurchaserId(
				trade.getId().toString(), seller.getId().toString(), purchaser.getId().toString()).orElseThrow();
			tradeLocationId = tradeLocation.getId();
		}

		return CreateTradeLocationResponse.builder()
			.tradeLocationId(tradeLocationId)
			.build();
	}

	@Transactional
	public TradeMessageResponse updateTradeLocation(TradeMessageRequest request) {
		TradeLocation tradeLocation = tradeLocationRepository.findById(request.getTradeLocationId())
			.orElseThrow();
		Deal deal = tradeRepository.findById(Long.parseLong(tradeLocation.getDealId()))
			.orElseThrow(TradeNotFoundException::new);
		Member requestMember = memberRepository.findByNickname(request.getNickname())
			.orElseThrow(MemberNotFoundException::new);
		Member seller = memberRepository.findById(Long.parseLong(tradeLocation.getSellerId()))
			.orElseThrow(SellerNotFoundException::new);
		Member purchaser = memberRepository.findById(Long.parseLong(tradeLocation.getPurchaserId()))
			.orElseThrow(PurchaserNotFoundException::new);

		Double sellerLongitude;
		Double sellerLatitude;
		Double purchaserLongitude;
		Double purchaserLatitude;

		// 위치 정보를 보낸 사용자가 판매자(seller)인 경우 판매자 관련 정보 갱신
		if (requestMember.getId().equals(seller.getId())) {
			sellerLongitude = request.getLongitude();
			sellerLatitude = request.getLatitude();
			purchaserLongitude = tradeLocation.getPurchaserLongitude() == null ? null :
				Double.parseDouble(tradeLocation.getPurchaserLongitude());
			purchaserLatitude = tradeLocation.getPurchaserLatitude() == null ? null :
				Double.parseDouble(tradeLocation.getPurchaserLatitude());
			tradeLocation.updateSellerInfo(sellerLongitude.toString(), sellerLatitude.toString());
		}

		// 위치 정보를 보낸 사용자가 구매자(purchaser)인 경우 구매자 관련 정보 갱신
		else {
			sellerLongitude = tradeLocation.getSellerLongitude() == null ? null :
				Double.parseDouble(tradeLocation.getSellerLongitude());
			sellerLatitude = tradeLocation.getSellerLatitude() == null ? null :
				Double.parseDouble(tradeLocation.getSellerLatitude());
			purchaserLongitude = request.getLongitude();
			purchaserLatitude = request.getLatitude();
			tradeLocation.updatePurchaserInfo(purchaserLongitude.toString(), purchaserLatitude.toString());
		}

		// 두 거래자의 위치 정보가 모두 존재하면 거리 계산 후 갱신
		Double distance = null;
		if (sellerLongitude != null && sellerLatitude != null && purchaserLongitude != null
			&& purchaserLatitude != null) {
			distance = CheckDistanceUtil.getDistance(sellerLatitude, sellerLongitude, purchaserLatitude,
				purchaserLongitude);
			tradeLocation.updateDistance(distance.toString());
		}

		// Redis에 정보 업데이트
		// redisTemplate.opsForHash().delete("tradeRedis", tradeLocation.getId());
		// redisTemplate.opsForHash().put("tradeRedis", tradeLocation.getId(), tradeLocation);
		tradeLocationRepository.save(tradeLocation);

		LocationInfoResponse sellerLocationInfo = LocationInfoResponse.builder()
			.messageType("Location")
			.otherNickname(seller.getNickname())
			.otherLongitude(sellerLongitude)
			.otherLatitude(sellerLatitude)
			.distance(distance)
			.build();

		LocationInfoResponse purchaserLocationInfo = LocationInfoResponse.builder()
			.messageType("Location")
			.otherNickname(purchaser.getNickname())
			.otherLongitude(purchaserLongitude)
			.otherLatitude(purchaserLatitude)
			.distance(distance)
			.build();

		return TradeMessageResponse.builder()
			.tradeLocationId(tradeLocation.getId())
			.dealId(deal.getId())
			.sellerNickname(seller.getNickname())
			.purchaserNickname(purchaser.getNickname())
			.sellerLocationInfo(sellerLocationInfo)
			.purchaserLocationInfo(purchaserLocationInfo)
			.build();
	}

	@Transactional
	public TradeMessageResponse terminateTrade(Long dealId, DoneMessageRequest request) {
		TradeLocation tradeLocation = tradeLocationRepository.findById(request.getTradeLocationId())
			.orElseThrow(TradeLocationNotFoundException::new);
		Member seller = memberRepository.findById(Long.parseLong(tradeLocation.getSellerId()))
			.orElseThrow(SellerNotFoundException::new);
		Member purchaser = memberRepository.findById(Long.parseLong(tradeLocation.getPurchaserId()))
			.orElseThrow(PurchaserNotFoundException::new);
		Trade trade = tradeRepository.findById(dealId).orElseThrow(TradeNotFoundException::new);
		// 이미 종료된 거래일 시 예외 호출
		if (!trade.getIsAvailable()) {
			throw new DealClosedException();
		}
		// 사용자 보유 금액 부족 시 예외 호출
		if (purchaser.getCashPoint() < trade.getPrice()) {
			throw new NotEnoughCashPointException();
		}
		// 구매자 보유 금액 차감
		purchaser.updateCashPoint((-1) * trade.getPrice());
		// 판매자 보유 금액 증가
		seller.updateCashPoint(trade.getPrice());
		// 거래 종료 처리
		trade.falseAvailable();

		return TradeMessageResponse.builder()
			.sellerNickname(seller.getNickname())
			.purchaserNickname(purchaser.getNickname())
			.build();
	}

	private void isEqualDealHostAndSeller(Trade trade, Member seller) {
		if (trade.getDealHost().getId() != seller.getId()) {
			throw new SellerNotValidException();
		}
	}

	private boolean checkAlreadyExistedTradeLocation(Long dealId, Long sellerId, Long purchaserId) {
		return tradeLocationRepository.existsByDealIdAndSellerIdAndPurchaserId(dealId.toString(), sellerId.toString(),
			purchaserId.toString());
	}
}
