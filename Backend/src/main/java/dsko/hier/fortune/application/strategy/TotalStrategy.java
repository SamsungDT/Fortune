package dsko.hier.fortune.application.strategy;

import dsko.hier.fortune.application.PromptSupplier;
import dsko.hier.fortune.application.pattern.FortuneAIGenerator;
import dsko.hier.fortune.domain.totalDomain.TotalFortune;
import dsko.hier.fortune.domain.totalDomain.TotalFortuneRepository;
import dsko.hier.fortune.dto.TotalFortuneResponse;
import dsko.hier.fortune.dto.ai.AITotalFortuneResponse;
import dsko.hier.global.redis.RedisHashService;
import dsko.hier.security.domain.User;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class TotalStrategy extends AbstractFortuneStrategy<TotalFortuneResponse> {

    private final TotalFortuneRepository repository;

    public TotalStrategy(FortuneAIGenerator fortuneAIGenerator, TotalFortuneRepository repository) {
        super(fortuneAIGenerator);
        this.repository = repository;
    }

    @Override
    protected String getPromptContent() {
        return PromptSupplier.total();
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
    protected TotalFortuneResponse processResult(User user, Object aiResponse) {
        AITotalFortuneResponse aiDailyResponse = (AITotalFortuneResponse) aiResponse;
        TotalFortune entity = AITotalFortuneResponse.toEntity(user, aiDailyResponse);
        TotalFortune save = repository.save(entity);
        return TotalFortuneResponse.fromEntity(save);
    }

    @Override
    protected Class<?> getAiResponseClass() {
        return AITotalFortuneResponse.class;
    }

    @Override
    public String getRedisType() {
        return RedisHashService.LIFE_LONG_FORTUNE_TYPE;
    }
}
