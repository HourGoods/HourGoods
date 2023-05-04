package org.a204.hourgoods.domain.concert.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class ConcertAlreadyExistsException extends GlobalBaseException {

	public ConcertAlreadyExistsException() {
		super(GlobalErrorCode.CONCERT_ALREADY_EXISTS);
	}
}
