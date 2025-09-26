package dsko.hier.fortune.daily.application;

import dsko.hier.fortune.application.PromptSupplier;
import dsko.hier.fortune.application.pattern.FortuneAIGenerator;
import dsko.hier.fortune.application.strategy.AbstractFortuneStrategy;
import dsko.hier.fortune.domain.dailyDomain.DailyFortune;
import dsko.hier.fortune.domain.dailyDomain.DailyFortuneRepository;
import dsko.hier.fortune.dto.DailyFortuneResponse;
import dsko.hier.fortune.dto.ai.AIDailyFortuneResponse;
import dsko.hier.global.redis.RedisHashService;
import dsko.hier.security.domain.User;
import java.util.Map;
import org.springframework.stereotype.Service;

/**
 * 오늘의 운세용 구체 전략 클래스
 */

@Service
public class DailyFortuneStrategy extends AbstractFortuneStrategy<DailyFortuneResponse> {

    private final DailyFortuneRepository dailyFortuneRepository;

    public DailyFortuneStrategy(FortuneAIGenerator fortuneAIGenerator, DailyFortuneRepository dailyFortuneRepository) {
        super(fortuneAIGenerator);
        this.dailyFortuneRepository = dailyFortuneRepository;
    }

    @Override
    protected String getPromptContent() {
        return PromptSupplier.daily();
    }

    @Override
    protected Map<String, Object> getPromptParams(User user, Object requestDto) {
        return Map.of(
                "name", user.getName(),
                "birthYear", user.getBirthInfo().getBirthYear(),
                "birthMonth", user.getBirthInfo().getBirthMonth(),
                "birthDay", user.getBirthInfo().getBirthDay(),
                "birthTime", user.getBirthInfo().getBirthTime(),
                "sex", user.getSex().toString()
        );
    }

    @Override
    protected DailyFortuneResponse processResult(User user, Object aiResponse) {
        AIDailyFortuneResponse aiDailyResponse = (AIDailyFortuneResponse) aiResponse;
        DailyFortune dailyFortune = AIDailyFortuneResponse.toEntity(user, aiDailyResponse);
        DailyFortune savedFortune = dailyFortuneRepository.save(dailyFortune);
        return DailyFortuneResponse.fromEntity(savedFortune);
    }

    @Override
    protected Class<?> getAiResponseClass() {
        return AIDailyFortuneResponse.class;
    }

    @Override
    public String getRedisType() {
        return RedisHashService.DAILY_FORTUNE_TYPE;
    }
}