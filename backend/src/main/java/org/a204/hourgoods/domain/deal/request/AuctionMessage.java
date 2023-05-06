package org.a204.hourgoods.domain.deal.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuctionMessage {
    private String nickname;
    private String messageType;
    private String content;
    private Integer bidAmount;
}
