package dsko.hier.security.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    /**
     * JWT secret key
     */
    private String secret;

    /**
     * Access token 만료 시간(분)
     */
    private long accessExpirationMinutes;

    /**
     * Refresh token 만료 시간(일)
     */
    private long refreshExpirationDays;

    /**
     * JWT 토큰 헤더 이름
     */
    private String accessHeaderName;
}
