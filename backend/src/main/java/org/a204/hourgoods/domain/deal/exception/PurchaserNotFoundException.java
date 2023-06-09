package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class PurchaserNotFoundException extends GlobalBaseException {
	public PurchaserNotFoundException() {
		super(GlobalErrorCode.PURCHASER_NOT_FOUND);
	}
}
