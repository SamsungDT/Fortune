package dsko.hier.global.redis;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisUserCountService {

    private final RedisTemplate<String, Integer> redisTemplate;
    private final String USER_COUNT_PREFIX = "user_count:";

    /**
     * 키와 값을 설정합니다. (SET 명령어)
     */
    @PostConstruct
    public void setValue() {
        redisTemplate.opsForValue().set(USER_COUNT_PREFIX, 0);
    }

    /**
     * 키에 해당하는 값을 1 증가시킵니다. (INCR 명령어)
     */
    public void increment() {
        redisTemplate.opsForValue().increment(USER_COUNT_PREFIX);
    }

    /**
     * 키에 해당하는 값을 가져옵니다. (GET 명령어)
     */
    public Integer getValue() {
        return redisTemplate.opsForValue().get(USER_COUNT_PREFIX);
    }
}