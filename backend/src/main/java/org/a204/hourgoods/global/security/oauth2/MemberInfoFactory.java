package org.a204.hourgoods.global.security.oauth2;

import java.util.Map;

import org.a204.hourgoods.global.error.GlobalErrorCode;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * @author suker80
 * 요청에 따라 맞는 MemberInfo 클래스를 반환한다.
 */
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberInfoFactory {

	/**
	 * 요청에 따라 맞는 MemberInfo 클래스를 반환한다.
	 * @param attributes 속성
	 * @param authentication 요청 인증 인스턴스
	 * @return 요청에 맞는 MemberInfo 인스턴스
	 */
	public static MemberInfo getMemberInfo(Map<String, Object> attributes, OAuth2AuthenticationToken authentication) {
		String registrationId = authentication.getAuthorizedClientRegistrationId();

		if (registrationId.equals("kakao")) {
			return new KakaoMemberInfo(attributes);
		}
		throw new UnsupportedInfoException(GlobalErrorCode.UNSUPPORTED_INFO);
	}

}