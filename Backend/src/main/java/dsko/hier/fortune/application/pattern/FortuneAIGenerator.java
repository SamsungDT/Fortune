package dsko.hier.fortune.application.pattern;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Component;

/**
 * AI 호출 및 결과 저장 로직을 공통화한 컴포넌트
 */

@Component
@RequiredArgsConstructor
public class FortuneAIGenerator {

    private final ChatModel chatmodel;

    public <T> T callAI(String promptContent, Map<String, Object> params, Class<T> responseClass) {
        PromptTemplate promptTemplate = new PromptTemplate(promptContent);

        return ChatClient.create(chatmodel)
                .prompt()
                .user(promptTemplate.create(params).getContents())
                .call()
                .entity(responseClass);
    }
}