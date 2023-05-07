package org.a204.hourgoods.domain.deal.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class DealClosedException extends GlobalBaseException {
    public DealClosedException() {
        super(GlobalErrorCode.DEAL_CLOSED);
    }
}
