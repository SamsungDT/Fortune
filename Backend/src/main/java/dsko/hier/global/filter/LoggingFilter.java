package dsko.hier.global.filter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dsko.hier.global.domain.AccessLog;
import dsko.hier.global.exception.discord.DiscordService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

@Slf4j
public class LoggingFilter extends OncePerRequestFilter {

    private final DiscordService discordService;
    private final ObjectMapper objectMapper;

    public LoggingFilter(DiscordService discordService, ObjectMapper objectMapper) {
        this.discordService = discordService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (isIgnoredUrl(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        LocalDateTime requestAt = LocalDateTime.now();
        String traceId = UUID.randomUUID().toString();
        MDC.put("traceId", traceId);

        try {
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            LocalDateTime responseAt = LocalDateTime.now();
            long durationMs = java.time.Duration.between(requestAt, responseAt).toMillis();

            AccessLog accessLog = AccessLog.createAccessLogFromReqAndResp(wrappedRequest, wrappedResponse, traceId, requestAt,
                    responseAt, durationMs);

            logFormattedAccessLog(accessLog);
            wrappedResponse.copyBodyToResponse();
            MDC.clear();
        }
    }

    private boolean isIgnoredUrl(String uri) {
        return uri.startsWith("/actuator") || uri.startsWith("/health");
    }

    public void logFormattedAccessLog(AccessLog accessLog) {
        StringBuilder loggingContents = new StringBuilder();
        loggingContents.append("\n");

        createRequestLog(accessLog, loggingContents);
        createResponseLog(accessLog, loggingContents);

        if (accessLog.getStatus() >= 400) {
            discordService.sendMessage("## 🚨 HTTP Error\n\n```json\n" + loggingContents + "\n```");
        }

        log.info(loggingContents.toString());
    }

    private void createHeader(StringBuilder sb, boolean isRequest, boolean isError) {
        String requestHeader = "✈️ --- [Request] ---------------------------\n";
        String errorRequestHeader = "🚨 --- [Error Request] --------------------------\n";

        String responseHeader = "🚀 --- [Response] --------------------------\n";
        String errorResponseHeader = "❌ --- [Error Response] --------------------------\n";

        if (isRequest) {
            sb.append((isError ? errorRequestHeader : requestHeader));
        } else {
            sb.append((isError ? errorResponseHeader : responseHeader));
        }
    }

    private void createRequestLog(AccessLog accessLog, StringBuilder sb) {
        createHeader(sb, true, accessLog.getStatus() >= 400);

        sb.append("ID:       ").append(accessLog.getTraceId()).append("\n");
        sb.append("Method:   ").append(accessLog.getMethod()).append("\n");
        sb.append("URI:      ").append(accessLog.getUri());
        if (accessLog.getQueryString() != null) {
            sb.append("?").append(accessLog.getQueryString());
        }
        sb.append("\n");
        sb.append("From:     ").append(accessLog.getRemoteIp()).append("\n");
        sb.append("User-Agent: ").append(accessLog.getUserAgent()).append("\n");
        sb.append("Headers:  ").append(accessLog.getHeaders()).append("\n");

        if (accessLog.getRequestBody() != null && !accessLog.getRequestBody().isEmpty()) {
            sb.append("Request:  ").append("\n");
            try {
                JsonNode jsonNode = objectMapper.readTree(accessLog.getRequestBody());
                sb.append(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonNode)).append("\n");
            } catch (IOException e) {
                sb.append(accessLog.getRequestBody()).append("\n");
            }
        }
    }

    private void createResponseLog(AccessLog accessLog, StringBuilder sb) {
        createHeader(sb, false, accessLog.getStatus() >= 400);

        sb.append("Status:   ").append(accessLog.getStatus()).append("\n");
        sb.append("Duration: ").append(accessLog.getDurationMs()).append("ms\n");

        if (accessLog.getResponseBody() != null && !accessLog.getResponseBody().isEmpty()) {
            sb.append("Response: ").append("\n");
            try {
                JsonNode jsonNode = objectMapper.readTree(accessLog.getResponseBody());
                sb.append(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(jsonNode)).append("\n");
            } catch (IOException e) {
                sb.append(accessLog.getResponseBody()).append("\n");
            }
        }
        sb.append("--------------------------------------------------\n");
    }
}