package dsko.hier.global.exception;

import lombok.Getter;

@Getter
public enum CustomExcpMsgs {
    JWT_INVALID("유효하지 않거나 잘못된 JWT 토큰입니다."),
    USER_LOGIN_FAIL("아이디 또는 비밀번호가 일치하지 않습니다."),
    BAD_REQUEST_URL("잘못된 요청입니다. 요청 URL을 확인해주세요."),
    USER_NOT_FOUND("요청한 정보와 일치하는 사용자를 찾을 수 없습니다"),
    IMAGE_TYPE_INVALID("지원하지 않는 이미지 형식입니다. PNG, JPG, JPEG 형식만 가능합니다."),
    FREE_FORTUNE_COUNT_EXCEEDED("무료 운세 조회 횟수 3회를 초과했습니다.");

    private final String message;

    CustomExcpMsgs(String message) {
        this.message = message;
    }
}
