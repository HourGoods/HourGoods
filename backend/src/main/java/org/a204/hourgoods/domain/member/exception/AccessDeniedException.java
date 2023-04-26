package org.a204.hourgoods.domain.member.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class AccessDeniedException extends GlobalBaseException {

	public AccessDeniedException(GlobalErrorCode errorCode) {
		super(errorCode);
	}
}