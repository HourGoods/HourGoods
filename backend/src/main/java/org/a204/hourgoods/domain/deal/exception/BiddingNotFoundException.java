package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class BiddingNotFoundException extends GlobalBaseException {
	public BiddingNotFoundException() {
		super(GlobalErrorCode.BIDDING_NOT_FOUND);
	}
}
