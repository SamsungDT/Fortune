package dsko.hier.global.redis;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisHashService {

    private final RedisTemplate<String, Long> redisTemplate;

    private static final String FORTUNE_COUNT_KEY = "fortune:counts";

    public static final String DAILY_FORTUNE_TYPE = "daily";
    public static final String LIFE_LONG_FORTUNE_TYPE = "weekly";
    public static final String FACE_TYPE = "face";
    public static final String DREAM_TYPE = "dream";

    /**
     * 해시 키 내의 특정 필드 값을 1 증가시킵니다. (HINCRBY 명령어)
     */
    public void incrementFortuneCount(String type) {
        redisTemplate.opsForHash().increment(FORTUNE_COUNT_KEY, type, 1L);
    }

    /**
     * 해시 키에 포함된 모든 필드와 값을 가져옵니다. (HGETALL 명령어)
     */
    public Map<Object, Object> getAllFortuneCounts() {
        return redisTemplate.opsForHash().entries(FORTUNE_COUNT_KEY);
    }
}