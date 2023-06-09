package org.a204.hourgoods.domain.member.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class UserNotFoundException extends GlobalBaseException {

	public UserNotFoundException() {
		super(GlobalErrorCode.USER_NOT_FOUND);
	}
}
