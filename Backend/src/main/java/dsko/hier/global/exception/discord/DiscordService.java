package dsko.hier.global.exception.discord;

import java.io.PrintWriter;
import java.io.StringWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DiscordService {

    @Value("${discord.webhook.alert.global.error}")
    private String webhookUrl;

    public void sendMessage(String content) {
        try {
            DiscordMessage discordMessage = DiscordMessage.createDiscordMessage(content);
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.postForEntity(webhookUrl, discordMessage, String.class);
        } catch (Exception e) {
            log.error("Failed to send message to Discord: {}", e.getMessage());
        }
    }

    public void sendDetailedMessage(Throwable e) {
        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw));
        String stackTrace = sw.toString();

        String detailedMessage = String.format(
                "```java\n오류 발생: %s\n\n상세 스택 트레이스:\n%s\n```",
                e.getMessage(),
                stackTrace
        );

        // 디스코드 메시지 길이 제한(2000자)을 고려하여 적절히 자르거나 처리해야 합니다.
        if (detailedMessage.length() > 2000) {
            detailedMessage = detailedMessage.substring(0, 1997) + "...";
        }

        sendMessage(detailedMessage);
    }
}
