// DreamInterpreationStrategy.java (수정)
package dsko.hier.fortune.application.strategy;

import dsko.hier.fortune.application.PromptSupplier;
import dsko.hier.fortune.application.pattern.FortuneAIGenerator;
import dsko.hier.fortune.domain.dreamDomain.DreamAnalysisRepository;
import dsko.hier.fortune.dto.DeramKeyword;
import dsko.hier.fortune.dto.DreamRequestDto;
import dsko.hier.fortune.dto.DreamResponse;
import dsko.hier.fortune.dto.ai.AIDreamResponse;
import dsko.hier.global.redis.RedisHashService;
import dsko.hier.security.domain.User;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class DreamInterpreationStrategy extends AbstractFortuneStrategy<DreamResponse> {

    private final DreamAnalysisRepository dreamAnalysisRepository;

    public DreamInterpreationStrategy(FortuneAIGenerator fortuneAIGenerator, DreamAnalysisRepository repository) {
        super(fortuneAIGenerator);
        this.dreamAnalysisRepository = repository;
    }

    @Override
    protected String getPromptContent() {
        return PromptSupplier.dream();
    }

    @Override
    protected Map<String, Object> getPromptParams(User user, Object requestDto) {
        DreamRequestDto dreamRequestDto = (DreamRequestDto) requestDto;

        StringBuilder sb = new StringBuilder();
        for (DeramKeyword keyword : dreamRequestDto.keywords()) {
            sb.append(keyword.getKorean()).append(", ");
        }
        String keyWord = sb.toString().replaceAll(", $", "");

        return Map.of(
                "dream_description", dreamRequestDto.dreamDescription(),
                "mood", dreamRequestDto.dreamAtmosphere(),
                "keywords", keyWord
        );
    }

    @Override
    protected DreamResponse processResult(User user, Object aiResponse) {
        AIDreamResponse aiDreamResponse = (AIDreamResponse) aiResponse;
        return DreamResponse.fromEntity(
                dreamAnalysisRepository.save(
                        AIDreamResponse.toEntity(user, aiDreamResponse)
                )
        );
    }

    @Override
    protected Class<?> getAiResponseClass() {
        return AIDreamResponse.class;
    }

    @Override
    public String getRedisType() {
        return RedisHashService.DREAM_TYPE;
    }
}