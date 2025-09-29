package dsko.hier.fortune.dto;

import java.util.List;
import java.util.UUID;
import lombok.Builder;

public record AllOfMyResultResponse(
        List<SimpleResult> results
) {
    @Builder
    public record SimpleResult(
            ResultType resultType,
            UUID resultId,
            String createdAt
    ) {
    }

    public enum ResultType {
        DREAM,
        DAILY_FORTUNE,
        FACE,
        LIFE_LONG
    }
}
