package dsko.hier.security.application;

import dsko.hier.global.redis.RedisTokenService;
import dsko.hier.security.dto.response.TokenResponse;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtTokenService {

    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTokenService redisTokenService;

    public TokenResponse issueJwtAuth(String userEmail, String role) {
        String accessToken = jwtTokenProvider.createAccessToken(userEmail, role);
        String refreshToken = jwtTokenProvider.createRefreshToken(userEmail, role);

        LocalDateTime refreshTokenExp = jwtTokenProvider.getExpirationDateFromToken(refreshToken);
        //LocalDateTime -> long
        long refreshTokenExpMillisecond = java.time.Duration.between(LocalDateTime.now(), refreshTokenExp).toMillis();
        //Redis에 저장
        redisTokenService.saveRefreshToken(userEmail, refreshToken, refreshTokenExpMillisecond);

        return TokenResponse.of(accessToken, refreshToken);
    }

    public TokenResponse reissueJwtToken(String refreshToken) {
        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        String role = jwtTokenProvider.getRoleFromToken(refreshToken);

        // 리프레시 토큰 검증
        //a. 토큰 유효성 검사
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        //b. 토큰 만료 시간 검사
        if (jwtTokenProvider.getExpirationDateFromToken(refreshToken).isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Expired refresh token");
        }
        // 2. Redis에 저장된 리프레시 토큰과 일치하는지 확인
        String refreshTokenFromRedis = redisTokenService.getRefreshToken(username);
        if (refreshTokenFromRedis == null || !refreshTokenFromRedis.equals(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        // 3. 새로운 액세스 토큰 및 리프레시 토큰 발급
        return issueJwtAuth(username, role);
    }
}
