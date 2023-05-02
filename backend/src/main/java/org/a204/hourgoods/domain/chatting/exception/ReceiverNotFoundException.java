package org.a204.hourgoods.domain.chatting.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class ReceiverNotFoundException extends GlobalBaseException {
    public ReceiverNotFoundException() {
        super(GlobalErrorCode.RECEIVER_NOT_FOUND);
    }
}
