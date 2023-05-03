package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class DealTypeMissMatchException extends GlobalBaseException {
	public DealTypeMissMatchException() {
		super(GlobalErrorCode.DEAL_TYPE_MISS_MATCH);
	}
}
