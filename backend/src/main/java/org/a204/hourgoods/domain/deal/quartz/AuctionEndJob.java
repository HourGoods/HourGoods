package org.a204.hourgoods.domain.deal.quartz;

import lombok.RequiredArgsConstructor;
import org.a204.hourgoods.domain.deal.entity.AuctionInfo;
import org.a204.hourgoods.domain.deal.entity.Deal;
import org.a204.hourgoods.domain.deal.repository.AuctionRedisRepository;
import org.a204.hourgoods.domain.deal.repository.DealRepository;
import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

@RequiredArgsConstructor
public class AuctionEndJob implements Job {
    private final AuctionRedisRepository auctionRedisRepository;
    private final DealRepository dealRepository;
    @Override
    public void execute(JobExecutionContext context) {
        JobDataMap jobDataMap = context.getJobDetail().getJobDataMap();
        Long dealId = jobDataMap.getLong("auctionId");
        // 경매 종료 작업 처리
        Deal deal = dealRepository.findById(dealId).get();
        deal.falseAvailable();
        dealRepository.save(deal);
        // 입찰 기록 저장
        AuctionInfo auctionInfo = auctionRedisRepository.getAuctionInfo(dealId.toString());

    }
}
