package dsko.hier.fortune.lifelongFortune.dto.resposne;

public record LifelongFortuneResponse(
        Personality personality,
        Wealth wealth,
        LoveAndMarriage loveAndMarriage,
        Career career,
        Health health,
        TurningPoints turningPoints,
        GoodLuck goodLuck
) {
    public record Personality(
            String strength,
            String talent,
            String responsibility,
            String empathy
    ) {
    }

    public record Wealth(
            String twenties,
            String thirties,
            String forties,
            String fiftiesAndBeyond
    ) {
    }

    public record LoveAndMarriage(
            String firstLove,
            String marriageAge,
            String spouseMeeting,
            String marriedLife
    ) {
    }

    public record Career(
            String successfulFields,
            String careerChangeAge,
            String leadershipStyle,
            String entrepreneurship
    ) {
    }

    public record Health(
            String generalHealth,
            String weakPoint,
            String checkupReminder,
            String recommendedExercise
    ) {
    }

    public record TurningPoints(
            String first,
            String second,
            String third
    ) {
    }

    public record GoodLuck(
            String luckyColors,
            String luckyNumbers,
            String luckyDirection,
            String goodDays,
            String avoidances
    ) {
    }
}
