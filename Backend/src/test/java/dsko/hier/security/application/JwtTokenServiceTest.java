package dsko.hier.security.application;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dsko.hier.global.redis.RedisTokenService;
import dsko.hier.security.dto.response.TokenResponse;
import java.time.LocalDateTime;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class JwtTokenServiceTest {

    @InjectMocks
    private JwtTokenService jwtTokenService;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private RedisTokenService redisTokenService;

    @Test
    @DisplayName("토큰 발급이 성공적으로 수행되고, 리프레시 토큰이 레디스에 저장되어야 한다")
    void issueJwtAuth_shouldIssueTokensAndSaveRefreshToken() {
        // Given
        String userEmail = "test@example.com";
        String role = "USER";
        String accessToken = "mock-access-token";
        String refreshToken = "mock-refresh-token";
        LocalDateTime expiration = LocalDateTime.now().plusHours(1);

        when(jwtTokenProvider.createAccessToken(userEmail, role)).thenReturn(accessToken);
        when(jwtTokenProvider.createRefreshToken(userEmail, role)).thenReturn(refreshToken);
        when(jwtTokenProvider.getExpirationDateFromToken(refreshToken)).thenReturn(expiration);

        // When
        TokenResponse response = jwtTokenService.issueJwtAuth(userEmail, role);

        // Then
        Assertions.assertThat(response.accessToken()).isEqualTo(accessToken);
        Assertions.assertThat(response.refreshToken()).isEqualTo(refreshToken);

        // RedisService의 saveRefreshToken 메서드가 올바른 인자들로 호출되었는지 검증
        verify(redisTokenService).saveRefreshToken(any(String.class), any(String.class), anyLong());
    }

    @Test
    @DisplayName("유효한 리프레시 토큰으로 새로운 토큰을 성공적으로 재발급해야 한다")
    void reissueJwtToken_shouldIssueNewTokens() {
        // Given
        String oldRefreshToken = "old-refresh-token";
        String username = "testuser";
        String role = "USER";
        LocalDateTime futureExpiration = LocalDateTime.now().plusHours(1);
        TokenResponse newTokens = new TokenResponse("new-access-token", "new-refresh-token");

        when(jwtTokenProvider.getUsernameFromToken(oldRefreshToken)).thenReturn(username);
        when(jwtTokenProvider.getRoleFromToken(oldRefreshToken)).thenReturn(role);
        when(jwtTokenProvider.validateToken(oldRefreshToken)).thenReturn(true);
        when(jwtTokenProvider.getExpirationDateFromToken(oldRefreshToken)).thenReturn(futureExpiration);
        when(redisTokenService.getRefreshToken(username)).thenReturn(oldRefreshToken);
        when(jwtTokenProvider.createAccessToken(username, role)).thenReturn(newTokens.accessToken());
        when(jwtTokenProvider.createRefreshToken(username, role)).thenReturn(newTokens.refreshToken());
        when(jwtTokenProvider.getExpirationDateFromToken(newTokens.refreshToken())).thenReturn(futureExpiration);

        // When
        TokenResponse response = jwtTokenService.reissueJwtToken(oldRefreshToken);

        // Then
        Assertions.assertThat(response.accessToken()).isEqualTo(newTokens.accessToken());
        Assertions.assertThat(response.refreshToken()).isEqualTo(newTokens.refreshToken());
        verify(redisTokenService, times(1)).getRefreshToken(username);
    }

    @Test
    @DisplayName("유효하지 않은 리프레시 토큰일 경우 예외를 던져야 한다")
    void reissueJwtToken_shouldThrowExceptionForInvalidToken() {
        // Given
        String invalidRefreshToken = "invalid-token";
        when(jwtTokenProvider.getUsernameFromToken(invalidRefreshToken)).thenReturn("user");
        when(jwtTokenProvider.getRoleFromToken(invalidRefreshToken)).thenReturn("USER");
        when(jwtTokenProvider.validateToken(invalidRefreshToken)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> jwtTokenService.reissueJwtToken(invalidRefreshToken))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid refresh token");
    }

    @Test
    @DisplayName("만료된 리프레시 토큰일 경우 예외를 던져야 한다")
    void reissueJwtToken_shouldThrowExceptionForExpiredToken() {
        // Given
        String expiredRefreshToken = "expired-token";
        String username = "testuser";
        when(jwtTokenProvider.getUsernameFromToken(expiredRefreshToken)).thenReturn(username);
        when(jwtTokenProvider.validateToken(expiredRefreshToken)).thenReturn(true);
        when(jwtTokenProvider.getExpirationDateFromToken(expiredRefreshToken)).thenReturn(
                LocalDateTime.now().minusHours(1));

        // When & Then
        assertThatThrownBy(() -> jwtTokenService.reissueJwtToken(expiredRefreshToken))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Expired refresh token");
    }

    @Test
    @DisplayName("레디스의 토큰과 일치하지 않을 경우 예외를 던져야 한다")
    void reissueJwtToken_shouldThrowExceptionForMismatchedToken() {
        // Given
        String clientRefreshToken = "client-refresh-token";
        String redisRefreshToken = "redis-refresh-token";
        String username = "testuser";
        LocalDateTime futureExpiration = LocalDateTime.now().plusHours(1);

        when(jwtTokenProvider.getUsernameFromToken(clientRefreshToken)).thenReturn(username);
        when(jwtTokenProvider.getRoleFromToken(clientRefreshToken)).thenReturn("USER");
        when(jwtTokenProvider.validateToken(clientRefreshToken)).thenReturn(true);
        when(jwtTokenProvider.getExpirationDateFromToken(clientRefreshToken)).thenReturn(futureExpiration);
        when(redisTokenService.getRefreshToken(username)).thenReturn(redisRefreshToken);

        // When & Then
        assertThatThrownBy(() -> jwtTokenService.reissueJwtToken(clientRefreshToken))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid refresh token");
    }
}