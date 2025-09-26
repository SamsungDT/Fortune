package dsko.hier.fortune.dto;

import dsko.hier.fortune.domain.dailyDomain.Advice;
import dsko.hier.fortune.domain.dailyDomain.Career;
import dsko.hier.fortune.domain.dailyDomain.DailyFortune;
import dsko.hier.fortune.domain.dailyDomain.Health;
import dsko.hier.fortune.domain.dailyDomain.Keywords;
import dsko.hier.fortune.domain.dailyDomain.Love;
import dsko.hier.fortune.domain.dailyDomain.Precautions;
import dsko.hier.fortune.domain.dailyDomain.Wealth;
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