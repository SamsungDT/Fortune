package dsko.hier.security.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dsko.hier.global.redis.RedisTokenService;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

@ExtendWith(MockitoExtension.class)
class RedisTokenServiceTest {

    @InjectMocks
    private RedisTokenService redisTokenService;

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Test
    @DisplayName("리프레시 토큰을 성공적으로 저장해야 한다")
    void saveRefreshTokenTest() {
        // Given
        String username = "user123";
        String token = "sample-refresh-token";
        long expiration = 3600000L;

        // RedisTemplate의 opsForValue()가 모의 객체를 반환하도록 설정
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        // When
        redisTokenService.saveRefreshToken(username, token, expiration);

        // Then
        // opsForValue().set()가 올바른 인자들로 호출되었는지 검증
        verify(valueOperations, times(1)).set("refresh:user123", token, expiration, TimeUnit.MILLISECONDS);
    }

    @Test
    @DisplayName("리프레시 토큰을 성공적으로 조회해야 한다")
    void getRefreshTokenTest() {
        // Given
        String username = "user123";
        String token = "sample-refresh-token";

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("refresh:user123")).thenReturn(token);

        // When
        String result = redisTokenService.getRefreshToken(username);

        // Then
        assertThat(result).isEqualTo(token);
        // opsForValue().get()가 올바른 인자들로 호출되었는지 검증
        verify(valueOperations, times(1)).get("refresh:user123");
    }

    @Test
    @DisplayName("리프레시 토큰을 성공적으로 삭제해야 한다")
    void deleteRefreshTokenTest() {
        // Given
        String username = "user123";

        // When
        redisTokenService.deleteRefreshToken(username);

        // Then
        // redisTemplate.delete()가 올바른 인자로 호출되었는지 검증
        verify(redisTemplate, times(1)).delete("refresh:user123");
    }

    @Test
    @DisplayName("토큰을 블랙리스트에 성공적으로 추가해야 한다")
    void addTokenToBlacklistTest() {
        // Given
        String tokenJti = "jti-123";
        long expiration = 300000L;

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        // When
        redisTokenService.addTokenToBlacklist(tokenJti, expiration);

        // Then
        // opsForValue().set()가 올바른 인자들로 호출되었는지 검증
        verify(valueOperations, times(1)).set("blacklist:jti-123", "invalidated", expiration, TimeUnit.MILLISECONDS);
    }

    @Test
    @DisplayName("토큰이 블랙리스트에 있는지 확인할 수 있어야 한다")
    void isTokenBlacklistedTest() {
        // Given
        String tokenJti = "jti-123";
        when(redisTemplate.hasKey("blacklist:jti-123")).thenReturn(true);

        // When
        boolean isBlacklisted = redisTokenService.isTokenBlacklisted(tokenJti);

        // Then
        assertThat(isBlacklisted).isTrue();
        // hasKey()가 올바른 인자로 호출되었는지 검증
        verify(redisTemplate, times(1)).hasKey("blacklist:jti-123");
    }
}