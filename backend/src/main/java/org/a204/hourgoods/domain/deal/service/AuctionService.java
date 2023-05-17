package org.a204.hourgoods.domain.deal.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
import org.a204.hourgoods.domain.deal.response.*;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.exception.MemberNotFoundException;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Set;

@Slf4j
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
        // 경매 결과 등록 스케줄러가 존재하는 지 확인하고 등록
        try {
            JobKey jobKey = new JobKey("auctionEndJob_" + dealId, "auctionEnd");
            if (!scheduler.checkExists(jobKey)) {
                // If not, schedule the job
                scheduleAuctionEnding(auction.getEndTime(), dealId);
                // Get all jobs in the group
                Set<JobKey> jobKeys = scheduler.getJobKeys(GroupMatcher.jobGroupEquals("auctionEnd"));
                // Loop through all jobs
                for (JobKey registered : jobKeys) {
                    // Get job details
                    JobDetail jobDetail = scheduler.getJobDetail(registered);
                    // Print job details to log
                    log.info("Job: " + registered.getName() + " Group: " + registered.getGroup() +
                        " Description: " + jobDetail.getDescription());
                }
            }
        } catch (SchedulerException e) {
            // handle exception
            log.error(e.getMessage(), e);
        }
        // 해당 dealId로 redis 기록이 있는지 확인
        // 있으면 추가
        if (auctionRedisRepository.isExist(dealId)) {
            return auctionRedisRepository.getAuctionInfo(dealId.toString()).toEntryResponse();
        }
        // 없으면 경매 시작 금액으로 생성
        else {
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
    public AuctionInOutMessage handleJoin(String dealId, AuctionMessage message) {
        AuctionInfo auctionInfo = auctionRedisRepository.addParticipant(dealId);
        return AuctionInOutMessage.builder()
                .messageType("JOIN")
                .nickname(message.getNickname())
                .participantCount(auctionInfo.getParticipantCount()).build();
    }
    public AuctionInOutMessage handleExit(String dealId) {
        AuctionInfo auctionInfo = auctionRedisRepository.removeParticipant(dealId);
        return AuctionInOutMessage.builder()
                .messageType("EXIT")
                .participantCount(auctionInfo.getParticipantCount()).build();
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
        Auction auction = auctionRepository.findById(dealId).get();
        // 1. 주최자 인 경우
        if (retrieved.getId().equals(deal.getDealHost().getId())) {
            AuctionResultResponse response = AuctionResultResponse.builder()
                .isHost(true)
                .bidderCount(auction.getBidderCount())
                .winnerAmount(auction.getFinalPrice()).build();
            if (auction.getWinner() != null) {
                Long winnerId = auction.getWinner().getId();
                Member winner = memberRepository.findById(winnerId).orElseThrow(MemberNotFoundException::new);
                response.setWinnerNickname(winner.getNickname());
            }
            return response;
        } else {
            Bidding bidding = biddingRepository.findByBidderAndDeal(retrieved, deal).orElseThrow(BiddingNotFoundException::new);
            AuctionResultResponse response = AuctionResultResponse.builder()
                .isHost(false)
                .bidderCount(auction.getBidderCount())
                .bidAmount(bidding.getBidAmount()).build();
        // 2. 낙찰자 인 경우
            Boolean isWinner = bidding.getIsWinner();
            if (isWinner) {
                response.setIsWinner(true);
            } else {
        // 3. 낙찰에 실패한 입찰자 인 경우
                response.setIsWinner(false);
                response.setWinnerAmount(auction.getFinalPrice());
            }
            return response;
        }
    }
}
