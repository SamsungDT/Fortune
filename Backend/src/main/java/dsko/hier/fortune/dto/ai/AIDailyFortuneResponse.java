package dsko.hier.fortune.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import dsko.hier.fortune.domain.dailyDomain.Advice;
import dsko.hier.fortune.domain.dailyDomain.Career;
import dsko.hier.fortune.domain.dailyDomain.DailyFortune;
import dsko.hier.fortune.domain.dailyDomain.Health;
import dsko.hier.fortune.domain.dailyDomain.Keywords;
import dsko.hier.fortune.domain.dailyDomain.Love;
import dsko.hier.fortune.domain.dailyDomain.Precautions;
import dsko.hier.fortune.domain.dailyDomain.Wealth;
import dsko.hier.security.domain.User;

public record AIDailyFortuneResponse(
        @JsonProperty("overallRating") int overallRating,
        @JsonProperty("overallSummary") String overallSummary,
        @JsonProperty("wealth") Wealth wealth,
        @JsonProperty("love") Love love,
        @JsonProperty("career") Career career,
        @JsonProperty("health") Health health,
        @JsonProperty("keywords") Keywords keywords,
        @JsonProperty("precautions") Precautions precautions,
        @JsonProperty("advice") Advice advice,
        @JsonProperty("tomorrowPreview") String tomorrowPreview
) {
    public static DailyFortune toEntity(User user, AIDailyFortuneResponse resp) {
        return DailyFortune.builder()
                .user(user)
                .resp(resp)
                .build();
    }

}