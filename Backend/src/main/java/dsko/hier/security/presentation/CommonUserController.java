package dsko.hier.security.presentation;

import dsko.hier.global.response.APIResponse;
import dsko.hier.security.application.LoginService;
import dsko.hier.security.dto.response.TokenResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/security/common")
@RequiredArgsConstructor
public class CommonUserController {

    private final LoginService loginService;

    //로그인은 어느 방식이던 간에 하나의 엔드포인트만 제공하자
    //UPDATE -> 회원 정보 수정
    //DELETE -> 1. 회원 탈퇴 2. 로그아웃
    //READ -> 회원 정보 조회

    // 로그아웃 엔드포인트
    @PostMapping("/logout")
    public APIResponse<Void> logout(@RequestHeader("Authorization") String token) {
        loginService.logout(token);
        return APIResponse.success();
    }

    // 액세스 토큰 갱신 엔드포인트
    @PostMapping("/refresh")
    public APIResponse<TokenResponse> refresh(@RequestHeader("Authorization") String refreshToken) {
        TokenResponse tokenResponse = loginService.tokenReIssue(refreshToken);
        return APIResponse.success(tokenResponse);
    }
}
