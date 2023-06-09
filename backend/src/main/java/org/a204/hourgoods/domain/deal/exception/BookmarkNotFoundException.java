package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class BookmarkNotFoundException extends GlobalBaseException {
	public BookmarkNotFoundException() {
		super(GlobalErrorCode.BOOKMARK_NOT_FOUND);
	}
}
