package dsko.hier.fortune.daily.dto.response;

import dsko.hier.fortune.daily.domain.Advice;
import dsko.hier.fortune.daily.domain.Career;
import dsko.hier.fortune.daily.domain.DailyFortune;
import dsko.hier.fortune.daily.domain.Health;
import dsko.hier.fortune.daily.domain.Keywords;
import dsko.hier.fortune.daily.domain.Love;
import dsko.hier.fortune.daily.domain.Precautions;
import dsko.hier.fortune.daily.domain.Wealth;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;

@Builder
public record DailyFortuneResponse(
        UUID id,
        LocalDateTime fortuneDate,
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
    public static DailyFortuneResponse fromEntity(DailyFortune fortune) {
        return DailyFortuneResponse.builder()
                .id(fortune.getId())
                .fortuneDate(fortune.getCreatedAt())
                .overallRating(fortune.getOverallRating())
                .overallSummary(fortune.getOverallSummary())
                .wealth(fortune.getFortuneWealth())
                .love(fortune.getFortuneLove())
                .career(fortune.getFortuneCareer())
                .health(fortune.getFortuneHealth())
                .keywords(fortune.getFortuneKeywords())
                .precautions(fortune.getFortunePrecautions())
                .advice(fortune.getFortuneAdvice())
                .tomorrowPreview(fortune.getTomorrowPreview())
                .build();
    }
}