package org.a204.hourgoods.domain.deal.entity;

import java.io.Serializable;
import java.util.HashMap;

import org.a204.hourgoods.domain.deal.response.AuctionEntryResponse;
import org.a204.hourgoods.domain.deal.response.GameAuctionEntryResponse;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
public class GameAuctionInfo implements Serializable {
	private Integer participantCount;
	private HashMap<String, Integer> bidHistory;
	@Builder
	public GameAuctionInfo() {
		participantCount = 0;
		bidHistory = new HashMap<>();
	}
	public void addParticipant() {
		this.participantCount += 1;
	}
	public void removeParticipant() {
		this.participantCount -= 1;
	}
	public GameAuctionEntryResponse toEntryResponse(Integer minimumPrice) {
		return GameAuctionEntryResponse.builder()
			.minimumPrice(minimumPrice)
			.participantCount(this.participantCount).build();
	}
}
