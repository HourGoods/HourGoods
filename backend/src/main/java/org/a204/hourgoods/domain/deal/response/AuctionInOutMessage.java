package org.a204.hourgoods.domain.deal.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AuctionInOutMessage {
    private String messageType;
    private String nickname;
    private Integer participantCount;
}
