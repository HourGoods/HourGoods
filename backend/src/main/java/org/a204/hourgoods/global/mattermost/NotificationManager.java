package org.a204.hourgoods.global.mattermost;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * Mattermost 전송을 관리 하는 빈
 */
@Component
@RequiredArgsConstructor
@Slf4j
@Profile("prod")
public class NotificationManager {

    private final MatterMostSender mmSender;

    /**
     * Mattermost 예외를 채널로 전송 한다.
     * @param e 발생한 예외
     * @param uri 요청한 uri
     * @param params 변수
     */
    public void sendNotification(Exception e, String uri, String params) {
        log.info("#### SEND error Notification");
        mmSender.sendExceptionMessage(e, uri, params);
    }

}
