package org.a204.hourgoods.domain.deal.service;

import java.time.LocalDateTime;

import org.a204.hourgoods.domain.deal.entity.Auction;
import org.a204.hourgoods.domain.deal.entity.GameAuction;
import org.a204.hourgoods.domain.deal.exception.DealClosedException;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.exception.DealYetStartException;
import org.a204.hourgoods.domain.deal.repository.AuctionRedisRepository;
import org.a204.hourgoods.domain.deal.repository.GameAuctionRepository;
import org.a204.hourgoods.domain.deal.response.AuctionEntryResponse;
import org.a204.hourgoods.domain.member.entity.Member;
import org.quartz.SchedulerException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HourAuctionService {
	private final GameAuctionRepository gameAuctionRepository;
	private final AuctionRedisRepository auctionRedisRepository;
	public AuctionEntryResponse entryAuction(Member member, Long dealId) {
		// 경매 시작 시간이 지났는지 확인
		GameAuction gameAuction = gameAuctionRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
		if (!gameAuction.getIsAvailable()) throw new DealClosedException();
		if (LocalDateTime.now().isBefore(gameAuction.getStartTime())) throw new DealYetStartException();
		// 해당 dealId로 redis 기록이 있는지 확인
		// 있으면 추가
		if (auctionRedisRepository.isExist(dealId)) {
			return auctionRedisRepository.getAuctionInfo(dealId.toString()).toEntryResponse();
		}
		// 없으면 경매 시작 금액으로 생성
		else {
			try {
				scheduleAuctionEnding(gameAuction.getEndTime(), dealId);
			} catch (SchedulerException e) {

			}
			return auctionRedisRepository.initAuction(gameAuction).toEntryResponse();
		}
	}
}
