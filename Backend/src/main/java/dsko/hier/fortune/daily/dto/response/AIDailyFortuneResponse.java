package dsko.hier.fortune.daily.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import dsko.hier.fortune.daily.domain.Advice;
import dsko.hier.fortune.daily.domain.Career;
import dsko.hier.fortune.daily.domain.DailyFortune;
import dsko.hier.fortune.daily.domain.Health;
import dsko.hier.fortune.daily.domain.Keywords;
import dsko.hier.fortune.daily.domain.Love;
import dsko.hier.fortune.daily.domain.Precautions;
import dsko.hier.fortune.daily.domain.Wealth;
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