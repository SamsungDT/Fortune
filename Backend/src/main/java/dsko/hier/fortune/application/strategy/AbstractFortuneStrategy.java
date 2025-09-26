package dsko.hier.fortune.application.strategy;

import static lombok.AccessLevel.PROTECTED;

import dsko.hier.fortune.application.pattern.FortuneAIGenerator;
import dsko.hier.security.domain.User;
import java.util.Map;
import lombok.RequiredArgsConstructor;

/**
 * 전략 패턴을 위한 추상 클래스 각 전략 클래스는 이 클래스를 상속받아 구체적인 구현을 제공
 *
 * @param <T>
 */

@RequiredArgsConstructor(access = PROTECTED)
public abstract class AbstractFortuneStrategy<T> implements FortuneStrategy<T> {

    protected final FortuneAIGenerator fortuneAIGenerator;

    protected abstract String getPromptContent();

    protected abstract Map<String, Object> getPromptParams(User user, Object requestDto);

    protected abstract T processResult(User user, Object aiResponse);

    protected abstract Class<?> getAiResponseClass();

    @Override
    public final T execute(User user, Object requestDto) {
        Object aiResponse = fortuneAIGenerator.callAI(
                getPromptContent(),
                getPromptParams(user, requestDto), // requestDto를 사용하도록 수정
                getAiResponseClass()
        );

        return processResult(user, aiResponse);
    }
}