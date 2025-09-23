package dsko.hier.global.exception;

import lombok.Getter;

@Getter
public enum CustomExcpMsgs {
    JWT_INVALID("유효하지 않거나 잘못된 JWT 토큰입니다.");

    private final String message;

    CustomExcpMsgs(String message) {
        this.message = message;
    }
}
