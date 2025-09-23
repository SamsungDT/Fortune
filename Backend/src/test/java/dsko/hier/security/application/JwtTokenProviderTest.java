package dsko.hier.security.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import dsko.hier.security.config.JwtProperties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class JwtTokenProviderTest {

    @InjectMocks
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private JwtProperties jwtProperties;

    // 테스트용 상수
    private static final String TEST_SECRET = "testsecretkeytestsecretkeytestsecretkeytestsecretkey";

    @BeforeEach
    void setUp() {
        // JwtProperties의 동작을 모킹
        when(jwtProperties.getSecret()).thenReturn(TEST_SECRET);

        // JwtTokenProvider의 PostConstruct 메서드 수동 호출
        jwtTokenProvider.initSecretKey();
    }

    @Test
    @DisplayName("만료된 토큰은 검증에 실패해야 한다")
    void testExpiredTokenValidation() {
        // Given
        String invalidSecret = "invalidsecretkeyinvalidsecretkeyinvalidsecretkey";
        SecretKey invalidKey = Keys.hmacShaKeyFor(invalidSecret.getBytes());

        String expiredToken = Jwts.builder()
                .claim("category", "access")
                .claim("username", "expired_user")
                .expiration(new Date(System.currentTimeMillis() - 10000)) // 10초 전 만료
                .signWith(invalidKey)
                .compact();

        // When
        boolean isValid = jwtTokenProvider.validateToken(expiredToken);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("잘못된 서명(변조된) 토큰은 검증에 실패해야 한다")
    void testInvalidSignatureTokenValidation() {
        // Given
        String username = "testuser";
        String invalidSecret = "invalidsecretkeyinvalidsecretkeyinvalidsecretkey";
        SecretKey invalidKey = Keys.hmacShaKeyFor(invalidSecret.getBytes());

        String tamperedToken = Jwts.builder()
                .claim("username", username)
                .expiration(new Date(System.currentTimeMillis() + 10000))
                .signWith(invalidKey)
                .compact();

        // When
        boolean isValid = jwtTokenProvider.validateToken(tamperedToken);

        // Then
        assertThat(isValid).isFalse();
    }
}