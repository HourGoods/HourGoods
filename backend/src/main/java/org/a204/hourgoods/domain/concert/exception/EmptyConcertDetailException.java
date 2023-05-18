package org.a204.hourgoods.domain.concert.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class EmptyConcertDetailException extends GlobalBaseException {
	public EmptyConcertDetailException() {
		super(GlobalErrorCode.EMPTY_CONCERT_DETAIL);
	}
}
