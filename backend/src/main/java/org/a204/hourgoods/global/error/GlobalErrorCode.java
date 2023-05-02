package org.a204.hourgoods.global.error;

import lombok.Getter;

/**
 * 프로젝트 내 사용되는 에러 코드
 */

@Getter
public enum GlobalErrorCode {

	/**
	 * 에러코드 규칙 :
	 * 1. 코드 맨 앞에는 연관된 Entity의 첫글자의 대문자를 적는다 ex)  Member -> M
	 * 2. 에러 코드와 이름 , 메시지가 최대한 모호하지 않게 작성합니다.
	 * 3. 공통으로 발생하는 에러에 대해서는 Global -> G를 붙여서 작성 합니다.
	 */
	SUCCESS(200, "G000", "요청에 성공하였습니다."),
	OTHER(500, "G100", "서버에 오류가 발생했습니다"),
	METHOD_NOT_ALLOWED(405, "G200", "허용되지 않은 메서드입니다"),
	VALID_EXCEPTION(400, "G300", ""),
	ACCESS_DENIED(401, "G400", "허용되지 않은 사용자입니다"),
	DEAL_TYPE_NOT_FOUNDED(404, "D100", "잘못된 Deal Type 형식입니다."),
	DEAL_NOT_FOUND(404, "D200", "해당 id에 해당하는 거래가 없습니다."),
	BOOKMARK_NOT_FOUND(404, "D300", "해당 사용자는 해당 거래를 북마크하지 않았습니다."),
	CONCERT_NOT_FOUND(404, "C100", "해당하는 공연을 찾을 수 없습니다."),
	CONCERT_ALREADY_EXISTS(400, "C200", "이미 등록된 공연 정보입니다."),
	UNSUPPORTED_INFO(400, "M100", "지원하지 않는 로그인 방식입니다."),
	INCORRECT_ADMIN_INFO(401, "M200", "관리자 로그인 정보가 틀렸습니다."),
	USER_NOT_FOUND(400, "M300", "해당 id에 해당하는 사용자가 없습니다."),
	MEMBER_MISS_MATCH(400, "M400", "요청한 사용자와 현재 사용자가 다릅니다."),
	;

	private final String code;
	private final String message;
	private final int status;

	GlobalErrorCode(final int status, final String code, final String message) {
		this.status = status;
		this.code = code;
		this.message = message;
	}
}
