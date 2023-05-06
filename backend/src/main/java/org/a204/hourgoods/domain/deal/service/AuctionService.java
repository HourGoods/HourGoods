package org.a204.hourgoods.domain.deal.service;

import lombok.RequiredArgsConstructor;
import org.a204.hourgoods.domain.deal.entity.Auction;
import org.a204.hourgoods.domain.deal.exception.DealClosedException;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.exception.DealYetStartException;
import org.a204.hourgoods.domain.deal.repository.AuctionRedisRepository;
import org.a204.hourgoods.domain.deal.repository.AuctionRepository;
import org.a204.hourgoods.domain.deal.response.AuctionEntryResponse;
import org.a204.hourgoods.domain.member.entity.Member;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuctionService {
    private final AuctionRepository auctionRepository;
    private final AuctionRedisRepository auctionRedisRepository;
    public AuctionEntryResponse entryAuction(Member member, Long dealId) {
        // 경매 시작 시간이 지났는지 확인
        Auction auction = auctionRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
        if (!auction.getIsAvailable()) throw new DealClosedException();
        if (LocalDateTime.now().isBefore(auction.getStartTime())) throw new DealYetStartException();
        // 해당 dealId로 redis 기록이 있는지 확인
        // 있으면 추가
        if (auctionRedisRepository.isExist(dealId)) {
            return auctionRedisRepository.addParticipant(dealId).toEntryResponse();
        }
        // 없으면 경매 시작 금액으로 생성
        else {
            return auctionRedisRepository.initAuction(auction).toEntryResponse();
        }
    }
}
