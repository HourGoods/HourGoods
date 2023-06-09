package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class SharingRankException extends GlobalBaseException {
	public SharingRankException() {
		super(GlobalErrorCode.SHARING_RANK);
	}
}
