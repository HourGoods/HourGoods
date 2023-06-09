package org.a204.hourgoods.domain.member.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class IncorrectAdminInfoException extends GlobalBaseException {
	public IncorrectAdminInfoException() {
		super(GlobalErrorCode.INCORRECT_ADMIN_INFO);
	}
}