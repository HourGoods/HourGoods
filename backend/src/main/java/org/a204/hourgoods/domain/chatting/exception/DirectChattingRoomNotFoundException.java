package org.a204.hourgoods.domain.chatting.exception;

import org.a204.hourgoods.global.error.GlobalBaseException;
import org.a204.hourgoods.global.error.GlobalErrorCode;

public class DirectChattingRoomNotFoundException extends GlobalBaseException {

    public DirectChattingRoomNotFoundException() {
        super(GlobalErrorCode.DIRECT_CHATTING_ROOM_NOT_FOUND);
    }
}
