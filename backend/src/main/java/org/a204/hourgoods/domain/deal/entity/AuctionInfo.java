package org.a204.hourgoods.domain.deal.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.a204.hourgoods.domain.deal.response.AuctionEntryResponse;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashMap;

@Getter
@NoArgsConstructor
public class AuctionInfo implements Serializable {
    private Integer currentBid;
    private Integer participantCount;
    private HashMap<String, Integer> bidHistory;
    private String bidder;
    @Builder
    public AuctionInfo(Integer minPrice) {
        this.currentBid = minPrice;
        this.participantCount = 0;
        this.bidder = null;
        this.bidHistory = new HashMap<>();
    }
    public void addParticipant() {
        this.participantCount += 1;
    }
    public void removeParticipant() {
        this.participantCount -= 1;
    }
    public void updateBidder(String nickname, Integer bidAmount) {
        this.bidder = nickname;
        this.currentBid = bidAmount;
    }
    public AuctionEntryResponse toEntryResponse() {
        return AuctionEntryResponse.builder()
                .currentBid(this.currentBid)
                .participantCount(this.participantCount)
                .currentTime(LocalDateTime.now().toString().split("\\.")[0]).build();
    }
}
