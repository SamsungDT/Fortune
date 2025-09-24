package dsko.hier.fortune.todayfortune.dto.response;

import java.time.LocalDate;
import java.util.UUID;
import lombok.Builder;

@Builder
public record DailyFortuneResponse(
        UUID id,
        LocalDate fortuneDate,
        int overallRating,
        String overallSummary,
        Wealth wealth,
        Love love,
        Career career,
        Health health,
        Keywords keywords,
        Precautions precautions,
        Advice advice,
        String tomorrowPreview
) {
    @Builder
    public record Wealth(
            String wealthSummary,
            String wealthTip1,
            String wealthTip2,
            String lottoNumbers
    ) {
    }

    @Builder
    public record Love(
            String single,
            String inRelationship,
            String married
    ) {
    }

    @Builder
    public record Career(
            String tip1,
            String tip2,
            String tip3,
            String tip4
    ) {
    }

    @Builder
    public record Health(
            String tip1,
            String tip2,
            String tip3,
            String tip4
    ) {
    }

    @Builder
    public record Keywords(
            String luckyColors,
            String luckyNumbers,
            String luckyTimes,
            String luckyDirection,
            String goodFoods
    ) {
    }

    @Builder
    public record Precautions(
            String precaution1,
            String precaution2,
            String precaution3,
            String precaution4
    ) {
    }

    @Builder
    public record Advice(
            String adviceText
    ) {
    }
}