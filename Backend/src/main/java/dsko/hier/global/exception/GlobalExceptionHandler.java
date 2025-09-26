package dsko.hier.global.exception;

import dsko.hier.global.exception.discord.DiscordService;
import dsko.hier.global.response.APIResponse;
import io.jsonwebtoken.JwtException;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final DiscordService discordService;

    @ExceptionHandler(NoResourceFoundException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public APIResponse<Object> handleBadRequest(NoResourceFoundException e) {
        log.warn("NoResourceFoundException 발생: {}", e.getMessage());
        discordService.sendDetailedMessage(e);
        return APIResponse.fail(HttpStatus.BAD_REQUEST.value(), CustomExcpMsgs.BAD_REQUEST_URL.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public APIResponse<Object> handleBadCredentialsException(BadCredentialsException e) {
        log.warn("BadCredentialsException 발생: {}", e.getMessage());
        discordService.sendDetailedMessage(e);
        return APIResponse.fail(HttpStatus.UNAUTHORIZED.value(), CustomExcpMsgs.USER_LOGIN_FAIL.getMessage());
    }

    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public APIResponse<Object> handleBindException(BindException e) {
        String message = e.getBindingResult().getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .distinct()
                .collect(Collectors.joining(", "));
        discordService.sendDetailedMessage(e);
        log.warn("BindException 발생: {}", message);
        return APIResponse.fail(HttpStatus.BAD_REQUEST.value(), message);
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public APIResponse<Object> handleRuntimeException(RuntimeException e) {
        log.warn("RuntimeException 발생: {}", e.getMessage());
        discordService.sendDetailedMessage(e);
        return APIResponse.fail(HttpStatus.BAD_REQUEST.value(), e.getMessage());
    }

    @ExceptionHandler(TooManyRequestsException.class)
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public APIResponse<Object> handleTooManyRequests(TooManyRequestsException e) {
        log.warn("TooManyRequestsException 발생: {}", e.getMessage());
        discordService.sendDetailedMessage(e);
        return APIResponse.fail(HttpStatus.TOO_MANY_REQUESTS.value(), e.getMessage());
    }

    @ExceptionHandler(JwtException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public APIResponse<Object> handleJwtException(JwtException e) {
        log.error("Jwt Exception 발생: ", e);
        discordService.sendDetailedMessage(e);
        return APIResponse.fail(HttpStatus.UNAUTHORIZED.value(), "Jwt가 없거나 만료되었습니다");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public APIResponse<Object> handleGeneralException(Exception e) {
        log.error("Unhandled Exception 발생: ", e);
        discordService.sendDetailedMessage(e);
        return APIResponse.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "예기치 못한 오류가 발생했습니다.");
    }
}