package dsko.hier.security.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dsko.hier.security.dto.request.EmailAndPassword;
import dsko.hier.security.dto.response.TokenResponse;
import java.util.Collections;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
class LoginServiceTest {

    @Autowired
    private LoginService loginService;

    @MockitoBean
    private AuthenticationManager authenticationManager;

    @MockitoBean
    private RedisService redisService;

    @MockitoBean
    private JwtTokenProvider tokenProvider;

    // JwtTokenService를 모킹합니다.
    @MockitoBean
    private JwtTokenService jwtTokenService;

    @Test
    @DisplayName("유효한 이메일과 비밀번호로 로그인 시 인증이 성공한다")
    void login_success() {
        // Given
        EmailAndPassword req = new EmailAndPassword("test@example.com", "password123");
        UserDetails userDetails = new User(req.email(), req.password(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")));

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()));

        // When & Then
        loginService.emailAndPasswordLogin(req);

        verify(authenticationManager, times(1))
                .authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("유효하지 않은 비밀번호로 로그인 시 BadCredentialsException 예외를 던진다")
    void login_failure_bad_credentials() {
        // Given
        EmailAndPassword req = new EmailAndPassword("test@example.com", "wrong_password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid password"));

        // When & Then
        assertThatThrownBy(() -> loginService.emailAndPasswordLogin(req))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Invalid password");
    }

    @Test
    @DisplayName("로그아웃 시 리프레시 토큰이 레디스에서 삭제되어야 한다")
    void logout_deletes_refresh_token() {
        // Given
        String rawToken = "Bearer test_token";
        String username = "testuser";

        when(tokenProvider.getUsernameFromToken("test_token")).thenReturn(username);
        loginService.logout(rawToken);

        // Then
        verify(redisService, times(1)).deleteRefreshToken(username);
    }

    @Test
    @DisplayName("토큰 재발급 요청 시 새로운 토큰이 반환된다")
    void tokenReIssue_returns_new_token() {
        // Given
        String rawToken = "Bearer refresh_token";
        TokenResponse expectedResponse = new TokenResponse("new_access_token", "new_refresh_token");

        // jwtTokenService.reissueJwtToken()이 특정 값을 반환하도록 설정
        when(jwtTokenService.reissueJwtToken("refresh_token")).thenReturn(expectedResponse);

        // When
        TokenResponse actualResponse = loginService.tokenReIssue(rawToken);

        // Then
        // 반환된 객체가 예상 값과 동일한지 검증
        assertThat(actualResponse).isEqualTo(expectedResponse);
        // jwtTokenService.reissueJwtToken()이 정확히 1번 호출되었는지 검증
        verify(jwtTokenService, times(1)).reissueJwtToken("refresh_token");
    }
}