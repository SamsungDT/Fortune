package dsko.hier.security.application;

import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, String> redisTemplate;
    private static final String KEY_PREFIX = "refresh:";
    private static final String BLACKLIST_PREFIX = "blacklist:";

    // 리프레시 토큰 저장
    public void saveRefreshToken(String username, String refreshToken, long expiration) {
        // 'refresh:' prefix를 사용하여 리프레시 토큰을 관리
        redisTemplate.opsForValue().set(KEY_PREFIX + username, refreshToken, expiration, TimeUnit.MILLISECONDS);
    }

    // 리프레시 토큰 조회
    public String getRefreshToken(String username) {
        return redisTemplate.opsForValue().get(KEY_PREFIX + username);
    }

    // 리프레시 토큰 삭제 (로그아웃 시 사용)
    public void deleteRefreshToken(String username) {
        redisTemplate.delete(KEY_PREFIX + username);
    }

    // 블랙리스트에 추가 (선택 사항)
    public void addTokenToBlacklist(String tokenJti, long expiration) {
        redisTemplate.opsForValue().set(BLACKLIST_PREFIX + tokenJti, "invalidated", expiration, TimeUnit.MILLISECONDS);
    }

    public boolean isTokenBlacklisted(String tokenJti) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(BLACKLIST_PREFIX + tokenJti));
    }

    public void clearAll() {
        redisTemplate.execute((RedisCallback<Void>) connection -> {
            connection.serverCommands().flushDb();
            return null;
        });
        log.info("Redis 데이터베이스가 초기화되었습니다.");
    }
}