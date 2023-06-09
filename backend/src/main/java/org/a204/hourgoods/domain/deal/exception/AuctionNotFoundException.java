package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class AuctionNotFoundException extends GlobalBaseException {
	public AuctionNotFoundException() {
		super(GlobalErrorCode.AUCTION_NOT_FOUND);
	}
}
