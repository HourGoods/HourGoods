package org.a204.hourgoods.global.security.oauth2;


/**
 * 유저 oauth 정보를 저장할 인터페이스
 * @author suker80
 *
 *
 */
public interface MemberInfo {

	/**
	 * @implNote 사용자의 이메일을 반환해야 한다.
	 * @return 사용자의 email
	 */
	String getEmail();

}