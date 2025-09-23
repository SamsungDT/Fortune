package dsko.hier.security.application;

import dsko.hier.security.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Jwts.SIG;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties properties;
    private final ZoneId zoneId = ZoneId.systemDefault();
    private SecretKey secretKey;

    private static final String USERNAME_CLAIM = "username";

    @PostConstruct
    public void initSecretKey() {
        this.secretKey = new SecretKeySpec(
                properties.getSecret().getBytes(StandardCharsets.UTF_8),
                SIG.HS256.key().build().getAlgorithm()
        );
    }

    public String createAccessToken(String username, String role) {
        LocalDateTime expiredTime = LocalDateTime.now().plusMinutes(properties.getAccessExpirationMinutes());
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .claim("category", "access")
                .claim(USERNAME_CLAIM, username)
                .claim("role", "ROLE_" + role)
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(expiredTime.atZone(zoneId).toInstant()))
                .signWith(secretKey)
                .compact();
    }

    public String createRefreshToken(String username, String role) {
        log.info("프로퍼티에 정의도어 있는 리프레시 토큰 만료 기간(일): {}",
                properties.getRefreshExpirationDays());
        LocalDateTime expiredTime = LocalDateTime.now().plusDays(properties.getRefreshExpirationDays());
        log.info("리프레시 토큰 만료 시간: {}", expiredTime);
        return Jwts.builder()
                .claim("category", "refresh")
                .claim(USERNAME_CLAIM, username)
                .claim("role", "ROLE_" + role)
                .issuedAt(Date.from(Instant.now()))
                .expiration(Date.from(expiredTime.atZone(zoneId).toInstant()))
                .signWith(secretKey)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.error("잘못된 JWT 서명입니다: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("만료된 JWT 토큰입니다: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("지원되지 않는 JWT 토큰입니다: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT 토큰이 잘못되었습니다: {}", e.getMessage());
        }
        return false;
    }

    public String getJwtIdFromToken(String token) {
        return parseClaims(token).getId();
    }

    public String getUsernameFromToken(String token) {
        return parseClaims(token).get(USERNAME_CLAIM, String.class);
    }

    public String getRoleFromToken(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public LocalDateTime getExpirationDateFromToken(String token) {
        Date expiration = parseClaims(token).getExpiration();
        return LocalDateTime.ofInstant(expiration.toInstant(), zoneId);
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}