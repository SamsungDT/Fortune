package dsko.hier.fortune.todayfortune.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import dsko.hier.fortune.todayfortune.domain.Advice;
import dsko.hier.fortune.todayfortune.domain.Career;
import dsko.hier.fortune.todayfortune.domain.Health;
import dsko.hier.fortune.todayfortune.domain.Keywords;
import dsko.hier.fortune.todayfortune.domain.Love;
import dsko.hier.fortune.todayfortune.domain.Precautions;
import dsko.hier.fortune.todayfortune.domain.Wealth;

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
}