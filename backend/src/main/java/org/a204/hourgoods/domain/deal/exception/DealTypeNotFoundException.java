package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class DealTypeNotFoundException extends GlobalBaseException {

	public DealTypeNotFoundException() {
		super(GlobalErrorCode.DEAL_TYPE_NOT_FOUNDED);
	}

}
