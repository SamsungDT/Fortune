package dsko.hier.fortune.application.strategy;

import dsko.hier.fortune.application.PromptSupplier;
import dsko.hier.fortune.application.pattern.FortuneAIGenerator;
import dsko.hier.fortune.domain.faceDomain.Face;
import dsko.hier.fortune.domain.faceDomain.FaceRepository;
import dsko.hier.fortune.dto.FaceAnalyzeResponse;
import dsko.hier.fortune.dto.ai.AIFaceAnalyzeResult;
import dsko.hier.global.redis.RedisHashService;
import dsko.hier.security.domain.User;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class FaceStrategy extends AbstractFortuneStrategy<FaceAnalyzeResponse> {

    private final FaceRepository repository;

    public FaceStrategy(FortuneAIGenerator fortuneAIGenerator, FaceRepository repository) {
        super(fortuneAIGenerator);
        this.repository = repository;
    }

    @Override
    protected String getPromptContent() {
        return PromptSupplier.face();
    }

    @Override
    protected Map<String, Object> getPromptParams(User user, Object requestDto) {
        return Map.of(
                "name", user.getName(),
                "birthYear", user.getBirthInfo().getBirthYear()
        );
    }

    @Override
    protected FaceAnalyzeResponse processResult(User user, Object aiResponse) {
        AIFaceAnalyzeResult aiResult = (AIFaceAnalyzeResult) aiResponse;
        Face saveFaceAnalyzeResult = repository.save(
                AIFaceAnalyzeResult.toEntity(user, aiResult)
        );
        return FaceAnalyzeResponse.fromEntity(saveFaceAnalyzeResult);
    }

    @Override
    protected Class<?> getAiResponseClass() {
        return AIFaceAnalyzeResult.class;
    }

    @Override
    public String getRedisType() {
        return RedisHashService.FACE_TYPE;
    }
}
