package dsko.hier.security.application;

import static org.assertj.core.api.Assertions.assertThat;

import dsko.hier.global.exception.discord.DiscordService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest
@ActiveProfiles("test")
class JwtTokenProviderSpringBootTest {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private DiscordService discordService;

    @Test
    @DisplayName("액세스 토큰 생성 및 검증 테스트")
    void createAndValidateAccessToken() {
        // Given
        String username = "testuser";
        String role = "USER";

        // When
        String accessToken = jwtTokenProvider.createAccessToken(username, role);

        // Then
        assertThat(accessToken).isNotNull();
        assertThat(jwtTokenProvider.validateToken(accessToken)).isTrue();
        assertThat(jwtTokenProvider.getUsernameFromToken(accessToken)).isEqualTo(username);
        assertThat(jwtTokenProvider.getRoleFromToken(accessToken)).isEqualTo("ROLE_" + role);
        assertThat(jwtTokenProvider.getJwtIdFromToken(accessToken)).isNotNull();
    }

    @Test
    @DisplayName("리프레시 토큰 생성 및 검증 테스트")
    void createAndValidateRefreshToken() {
        // Given
        String username = "testuser";
        String role = "USER";

        // When
        String refreshToken = jwtTokenProvider.createRefreshToken(username, role);

        // Then
        assertThat(refreshToken).isNotNull();
        assertThat(jwtTokenProvider.validateToken(refreshToken)).isTrue();
        assertThat(jwtTokenProvider.getUsernameFromToken(refreshToken)).isEqualTo(username);
        assertThat(jwtTokenProvider.getRoleFromToken(refreshToken)).isEqualTo("ROLE_" + role);
    }
}