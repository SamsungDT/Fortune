package dsko.hier.security.filter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dsko.hier.security.application.CustomUserDetailService;
import dsko.hier.security.application.JwtTokenProvider;
import dsko.hier.security.application.RedisService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private RedisService redisService;

    @Mock
    private CustomUserDetailService userDetailsService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private PrintWriter writer;

    @BeforeEach
    void setup() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    @Test
    @DisplayName("유효한 토큰일 경우 SecurityContext에 인증 정보를 설정한다")
    void testValidTokenAuthentication() throws ServletException, IOException {
        // Given
        String validJwt = "Bearer valid.jwt.token";
        String username = "testuser";
        String jti = "jwt-id-123";
        UserDetails userDetails = new User(username, "password", Collections.emptyList());

        when(request.getHeader("Authorization")).thenReturn(validJwt);
        when(tokenProvider.validateToken(anyString())).thenReturn(true);
        when(tokenProvider.getJwtIdFromToken(anyString())).thenReturn(jti);
        when(redisService.isTokenBlacklisted(jti)).thenReturn(false);
        when(tokenProvider.getUsernameFromToken(anyString())).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);

        // When
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Then
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNotNull();
        assertThat(authentication.getPrincipal()).isEqualTo(userDetails);
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    @DisplayName("블랙리스트에 있는 토큰일 경우 접근을 거부한다")
    void testBlacklistedTokenRejection() throws ServletException, IOException {
        // Given
        String blacklistedJwt = "Bearer blacklisted.jwt.token";
        String jti = "jwt-id-123";

        when(response.getWriter()).thenReturn(writer);
        when(request.getHeader("Authorization")).thenReturn(blacklistedJwt);
        when(tokenProvider.validateToken(anyString())).thenReturn(true);
        when(tokenProvider.getJwtIdFromToken(anyString())).thenReturn(jti);
        when(redisService.isTokenBlacklisted(jti)).thenReturn(true);

        // When
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Then
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        verify(response).setContentType("application/json;charset=UTF-8");
        verify(writer, times(1)).print(anyString()); // ⬅️ writer.print() 호출을 검증
        verify(filterChain, never()).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    @DisplayName("유효하지 않은 토큰일 경우 다음 필터로 넘긴다")
    void testInvalidTokenBypass() throws ServletException, IOException {
        // Given
        String invalidJwt = "Bearer invalid.jwt.token";

        when(request.getHeader("Authorization")).thenReturn(invalidJwt);
        when(tokenProvider.validateToken(anyString())).thenReturn(false);

        // When
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Then
        verify(filterChain, times(1)).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }
}