package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class SellerNotFoundException extends GlobalBaseException {
	public SellerNotFoundException() {
		super(GlobalErrorCode.SELLER_NOT_FOUND);
	}
}
