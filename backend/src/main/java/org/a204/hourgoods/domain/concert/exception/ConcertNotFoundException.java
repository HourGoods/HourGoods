package org.a204.hourgoods.domain.concert.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class ConcertNotFoundException extends GlobalBaseException {

	public ConcertNotFoundException() {
		super(GlobalErrorCode.CONCERT_NOT_FOUND);
	}
}
