package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class NotEnoughCashPointException extends GlobalBaseException {
	public NotEnoughCashPointException() {
		super(GlobalErrorCode.NOT_ENOUGH_CASH_POINT);
	}
}
