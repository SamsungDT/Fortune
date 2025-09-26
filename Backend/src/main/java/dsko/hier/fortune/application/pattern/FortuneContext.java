package dsko.hier.fortune.application.pattern;

import dsko.hier.fortune.application.strategy.FortuneStrategy;
import dsko.hier.global.redis.RedisHashService;
import dsko.hier.security.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FortuneContext {

    private final UserValidator userValidator;
    private final RedisHashService redisHashService;

    public <T> T getFortune(String userEmail, FortuneStrategy<T> strategy, Object requestDto) {
        // 1. 사용자 정보 조회 및 예외 처리
        User user = userValidator.validate(userEmail);

        // 2. 전략에 따라 AI 호출 및 결과 반환
        T result = strategy.execute(user, requestDto);

        // 3. Redis 카운트 증가
        redisHashService.incrementFortuneCount(strategy.getRedisType());

        return result;
    }
}
