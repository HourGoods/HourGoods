package org.a204.hourgoods.domain.deal.entity;

import lombok.Builder;
import lombok.Getter;
import org.a204.hourgoods.domain.deal.response.AuctionEntryResponse;

import java.io.Serializable;
import java.util.HashMap;

@Getter
public class AuctionInfo implements Serializable {
    private Integer currentBid;
    private Integer participantCount;
    private HashMap<String, Integer> bidHistory;
    private String bidder;
    @Builder
    public AuctionInfo(Integer minPrice) {
        this.currentBid = minPrice;
        this.participantCount = 1;
        this.bidder = null;
        this.bidHistory = new HashMap<>();
    }
    public void addParticipant() {
        this.participantCount += 1;
    }
    public AuctionEntryResponse toEntryResponse() {
        return AuctionEntryResponse.builder()
                .currentBid(this.currentBid)
                .participantCount(this.participantCount).build();
    }
}
