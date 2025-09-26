package dsko.hier.global.exception;

import ch.qos.logback.classic.spi.ILoggingEvent;
import lombok.Getter;

@Getter
public enum CustomExcpMsgs {
    JWT_INVALID("유효하지 않거나 잘못된 JWT 토큰입니다."),
    USER_NOT_FOUND("요청한 정보와 일치하는 사용자를 찾을 수 없습니다"),
    FREE_FORTUNE_COUNT_EXCEEDED("무료 운세 조회 횟수 3회를 초과했습니다."),
    USER_LOGIN_FAIL("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요."),
    BAD_REQUEST_URL("잘못된 요청입니다. URL을 확인해주세요.");

    private final String message;

    CustomExcpMsgs(String message) {
        this.message = message;
    }
}
