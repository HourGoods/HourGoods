package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class DealNotFoundException extends GlobalBaseException {
	public DealNotFoundException() {
		super(GlobalErrorCode.DEAL_NOT_FOUND);
	}
}
