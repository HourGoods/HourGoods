package org.a204.hourgoods.domain.deal.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AuctionBidMessage {
    private String messageType;
    private Integer currentBid;
    private Integer interval;
    private Integer participantCount;
}
