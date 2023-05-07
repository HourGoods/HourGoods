package org.a204.hourgoods.domain.deal.quartz;

import org.quartz.Job;
import org.quartz.JobDataMap;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class AuctionEndJob implements Job {
    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        JobDataMap jobDataMap = context.getJobDetail().getJobDataMap();
        Long auctionId = jobDataMap.getLong("auctionId");
        // 경매 종료 작업 처리
    }
}
