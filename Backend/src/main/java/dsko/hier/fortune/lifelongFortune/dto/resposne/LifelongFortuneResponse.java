package dsko.hier.fortune.lifelongFortune.dto.resposne;

import java.util.UUID;
import lombok.Builder;

/**
 * 평생운세 응답 DTO
 */
@Builder
public record LifelongFortuneResponse(
        UUID id,
        Personality personality,
        Wealth wealth,
        LoveAndMarriage loveAndMarriage,
        Career career,
        Health health,
        TurningPoints turningPoints,
        GoodLuck goodLuck
) {
    @Builder
    public record Personality(
            String strength,
            String talent,
            String responsibility,
            String empathy
    ) {
    }

    @Builder
    public record Wealth(
            String twenties,
            String thirties,
            String forties,
            String fiftiesAndBeyond
    ) {
    }

    @Builder
    public record LoveAndMarriage(
            String firstLove,
            String marriageAge,
            String spouseMeeting,
            String marriedLife
    ) {
    }

    @Builder
    public record Career(
            String successfulFields,
            String careerChangeAge,
            String leadershipStyle,
            String entrepreneurship
    ) {
    }

    @Builder
    public record Health(
            String generalHealth,
            String weakPoint,
            String checkupReminder,
            String recommendedExercise
    ) {
    }

    @Builder
    public record TurningPoints(
            String first,
            String second,
            String third
    ) {
    }

    @Builder
    public record GoodLuck(
            String luckyColors,
            String luckyNumbers,
            String luckyDirection,
            String goodDays,
            String avoidances
    ) {
    }
}
