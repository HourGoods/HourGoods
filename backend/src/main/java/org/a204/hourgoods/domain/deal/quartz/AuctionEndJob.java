package org.a204.hourgoods.domain.deal.quartz;

import java.util.Map;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.a204.hourgoods.domain.bidding.entity.Bidding;
import org.a204.hourgoods.domain.bidding.repository.BiddingRepository;
import org.a204.hourgoods.domain.deal.entity.Auction;
import org.a204.hourgoods.domain.deal.entity.AuctionInfo;
import org.a204.hourgoods.domain.deal.exception.DealNotFoundException;
import org.a204.hourgoods.domain.deal.repository.AuctionRedisRepository;
import org.a204.hourgoods.domain.deal.repository.AuctionRepository;
import org.a204.hourgoods.domain.member.entity.Member;
import org.a204.hourgoods.domain.member.exception.MemberNotFoundException;
import org.a204.hourgoods.domain.member.repository.MemberRepository;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.springframework.transaction.annotation.Transactional;
@Slf4j
@RequiredArgsConstructor
public class AuctionEndJob implements Job {
    private final AuctionRedisRepository auctionRedisRepository;
    private final AuctionRepository auctionRepository;
    private final BiddingRepository biddingRepository;
    private final MemberRepository memberRepository;
    @Override
    @Transactional
    public void execute(JobExecutionContext context) {
        log.debug("경매 종료 후 결과 처리 작업 시작");

        JobDataMap jobDataMap = context.getJobDetail().getJobDataMap();
        Long dealId = jobDataMap.getLong("auctionId");
        // 경매 종료 작업 처리
        Auction auction = auctionRepository.findById(dealId).orElseThrow(DealNotFoundException::new);
        auction.falseAvailable();

        AuctionInfo auctionInfo = auctionRedisRepository.getAuctionInfo(dealId.toString());
        // 경매 결과 제공
        Integer finalPrice = auctionInfo.getCurrentBid();
        Integer bidderCount = auctionInfo.getBidHistory().size();
        String winnerNickname = auctionInfo.getBidder();
        Member winner = null;
        if (winnerNickname != null) {
            winner = memberRepository.findByNickname(winnerNickname).orElseThrow(MemberNotFoundException::new);
        }
        auction.updateResult(finalPrice, bidderCount, winner);
        auctionRepository.save(auction);
        // 입찰 기록 저장
        for (Map.Entry<String, Integer> entry : auctionInfo.getBidHistory().entrySet()) {
            String nickname = entry.getKey();
            Integer bidAmount = entry.getValue();
            Member member = memberRepository.findByNickname(nickname).orElseThrow(MemberNotFoundException::new);
            Bidding bidding = Bidding.builder()
                .bidAmount(bidAmount)
                .isWinner(nickname.equals(auctionInfo.getBidder()))
                .member(member)
                .deal(auction).build();
            biddingRepository.save(bidding);
        }
        // redis 초기화
        auctionRedisRepository.deleteAuctionInfo(dealId);
    }
}
