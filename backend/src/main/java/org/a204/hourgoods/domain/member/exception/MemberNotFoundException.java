package org.a204.hourgoods.domain.member.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class MemberNotFoundException extends GlobalBaseException {
	public MemberNotFoundException() {
		super(GlobalErrorCode.USER_NOT_FOUND);
	}
}