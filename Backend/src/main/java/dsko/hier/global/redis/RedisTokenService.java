package dsko.hier.global.redis;

import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisTokenService {

    private final RedisTemplate<String, String> redisStringTemplate;
    private static final String REFRESH_KEY_PREFIX = "refresh:";
    private static final String BLACKLIST_PREFIX = "blacklist:";

    // 리프레시 토큰 저장
    public void saveRefreshToken(String username, String refreshToken, long expiration) {
        // 'refresh:' prefix를 사용하여 리프레시 토큰을 관리
        redisStringTemplate.opsForValue()
                .set(REFRESH_KEY_PREFIX + username, refreshToken, expiration, TimeUnit.MILLISECONDS);
    }

    // 리프레시 토큰 조회
    public String getRefreshToken(String username) {
        return redisStringTemplate.opsForValue().get(REFRESH_KEY_PREFIX + username);
    }

    // 리프레시 토큰 삭제 (로그아웃 시 사용)
    public void deleteRefreshToken(String username) {
        redisStringTemplate.delete(REFRESH_KEY_PREFIX + username);
    }

    // 블랙리스트에 추가 (선택 사항)
    public void addTokenToBlacklist(String tokenJti, long expiration) {
        redisStringTemplate.opsForValue()
                .set(BLACKLIST_PREFIX + tokenJti, "invalidated", expiration, TimeUnit.MILLISECONDS);
    }

    // 토큰이 블랙리스트에 있는지 확인 - JTI(토큰 고유 식별자) 사용
    public boolean isTokenBlacklisted(String tokenJti) {
        return Boolean.TRUE.equals(redisStringTemplate.hasKey(BLACKLIST_PREFIX + tokenJti));
    }

    // 토큰이 블랙리스트에 있는지 확인 - 사용자 이메일 사용
    public boolean isUserBlacklisted(String username) {
        return Boolean.TRUE.equals(redisStringTemplate.hasKey(BLACKLIST_PREFIX + username));
    }

    public void clearAll() {
        redisStringTemplate.delete(REFRESH_KEY_PREFIX);
        log.info("Redis 데이터베이스에 있는 모든 리프레쉬 토큰이 삭제되었습니다.");
    }
}