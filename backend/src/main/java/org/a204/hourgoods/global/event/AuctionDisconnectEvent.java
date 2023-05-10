package org.a204.hourgoods.global.event;

import org.springframework.context.ApplicationEvent;

public class AuctionDisconnectEvent extends ApplicationEvent {
    private final String dealId;

    public AuctionDisconnectEvent(Object source, String dealId) {
        super(source);
        this.dealId = dealId;
    }

    public String getDealId() {
        return dealId;
    }
}
