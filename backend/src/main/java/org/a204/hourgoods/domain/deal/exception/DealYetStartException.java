package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class DealYetStartException extends GlobalBaseException {
	public DealYetStartException() {
		super(GlobalErrorCode.DEAL_YET_START);
	}
}
