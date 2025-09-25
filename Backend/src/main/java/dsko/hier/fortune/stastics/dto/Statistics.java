package dsko.hier.fortune.stastics.dto;

import lombok.Builder;

@Builder
public record Statistics(

        Integer totalUsers,
        Integer faceResultCount,
        Integer lifeLongResultCount,
        Integer dailyFortuneResultCount,
        Integer dreamInterpretationResultCount

) {


}
