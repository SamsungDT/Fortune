package dsko.hier.global.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class CustomExceptions {
    public static class UserException extends RuntimeException {
        public UserException(String message) {
            super(message);
        }
    }

    public static class JwtException extends RuntimeException {
        public JwtException(String message) {
            super(message);
        }
    }

    public static class UserPlanException extends RuntimeException {
        public UserPlanException(String message) {
            super(message);
        }
    }

    public static class ImageException extends RuntimeException {
        public ImageException(String message) {
            super(message);
        }
    }
}
