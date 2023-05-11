package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class SellerNotValidException extends GlobalBaseException {
	public SellerNotValidException() {
		super(GlobalErrorCode.SELLER_NOT_VALID);
	}
}
