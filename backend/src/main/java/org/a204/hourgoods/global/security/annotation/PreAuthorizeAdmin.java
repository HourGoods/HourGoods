package org.a204.hourgoods.global.security.annotation;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import org.springframework.security.access.prepost.PreAuthorize;

/**
 * 메서드에 붙어있으면 관리자 권한을 인증해야 한다.
 */
@Retention(RetentionPolicy.RUNTIME)
@PreAuthorize("hasRole('ROLE_ADMIN')")
public @interface PreAuthorizeAdmin {
}