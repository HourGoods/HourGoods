package org.a204.hourgoods.domain.deal.service;

import lombok.RequiredArgsConstructor;

import org.a204.hourgoods.domain.bidding.entity.Bidding;
import org.a204.hourgoods.domain.bidding.repository.BiddingRepository;
import org.a204.hourgoods.domain.deal.entity.Auction;
import org.a204.hourgoods.domain.deal.entity.AuctionInfo;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.exception.BiddingNotFoundException;
import org.a204.hourgoods.domain.deal.exception.DealClosedException;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.exception.DealYetStartException;
import org.a204.hourgoods.domain.deal.quartz.AuctionEndJob;
import org.a204.hourgoods.domain.deal.repository.AuctionRedisRepository;
import org.a204.hourgoods.domain.deal.repository.AuctionRepository;
import org.a204.hourgoods.domain.deal.repository.DealRepository;
import org.a204.hourgoods.domain.deal.request.AuctionMessage;
import org.a204.hourgoods.domain.deal.response.AuctionBidMessage;
import org.a204.hourgoods.domain.deal.response.AuctionChatMessage;
import org.a204.hourgoods.domain.deal.response.AuctionEntryResponse;
import org.a204.hourgoods.domain.deal.response.AuctionResultResponse;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.exception.MemberNotFoundException;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.quartz.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuctionService {
    private final AuctionRepository auctionRepository;
    private final AuctionRedisRepository auctionRedisRepository;
    private final MemberRepository memberRepository;
    private final Scheduler scheduler;
    private final BiddingRepository biddingRepository;
    private final DealRepository dealRepository;

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
            try {
                scheduleAuctionEnding(auction.getEndTime(), dealId);
            } catch (SchedulerException e) {

            }
            return auctionRedisRepository.initAuction(auction).toEntryResponse();
        }
    }
    public AuctionChatMessage handleChat(String dealId, AuctionMessage message) {
        Member member = memberRepository.findByNickname(message.getNickname()).orElseThrow(MemberNotFoundException::new);
        return AuctionChatMessage.builder()
                .content(message.getContent())
                .imageUrl(member.getImageUrl())
                .messageType(message.getMessageType())
                .nickname(message.getNickname())
                .participantCount(auctionRedisRepository.getParticipantCount(dealId))
                .build();
    }
    public AuctionBidMessage handleBid(String dealId, AuctionMessage message) {
        String nickname = message.getNickname();
        Integer bidAmount = message.getBidAmount();
        AuctionInfo auctionInfo = auctionRedisRepository.getAuctionInfo(dealId);
        HashMap<String, Integer> bidHistory = auctionInfo.getBidHistory();
        Integer historyAmount = bidHistory.getOrDefault(nickname, 0);
        if (bidAmount > historyAmount) {
            bidHistory.put(nickname, bidAmount);
        }
        Integer currentBid = auctionInfo.getCurrentBid();
        Integer interval = null;
        if (bidAmount > currentBid) {
            interval = bidAmount - currentBid;
            auctionInfo.updateBidder(nickname, bidAmount);
        }
        AuctionInfo saved = auctionRedisRepository.saveAuctionInfo(dealId, auctionInfo);
        return AuctionBidMessage.builder()
                .currentBid(saved.getCurrentBid())
                .interval(interval)
                .messageType(message.getMessageType())
                .participantCount(auctionRedisRepository.getParticipantCount(dealId))
                .build();
    }
    private void scheduleAuctionEnding(LocalDateTime endTime, Long auctionId) throws SchedulerException {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put("auctionId", auctionId);

        JobDetail jobDetail = JobBuilder.newJob(AuctionEndJob.class)
                .withIdentity("auctionEndJob_" + auctionId, "auctionEnd")
                .usingJobData(jobDataMap)
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("auctionEndTrigger_" + auctionId, "auctionEnd")
                .startAt(Date.from(endTime.atZone(ZoneId.systemDefault()).toInstant()))
                .build();

        scheduler.scheduleJob(jobDetail, trigger);
    }
    public AuctionResultResponse getResult(Member member, Long dealId) {
        Long memberId = member.getId();
        Member retrieved = memberRepository.findById(memberId).orElseThrow(MemberNotFoundException::new);
        Deal deal = dealRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
        Bidding bidding = biddingRepository.findByDealAndMember(retrieved, deal).orElseThrow(BiddingNotFoundException::new);
        Auction auction = auctionRepository.findById(dealId).get();
        return AuctionResultResponse.builder()
            .isWinner(bidding.getIsWinner())
            .bidderCount(auction.getBidderCount())
            .bidAmount(bidding.getBidAmount())
            .build();
    }
}
