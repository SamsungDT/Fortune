package dsko.hier.fortune.dream.dto.response;

import dsko.hier.fortune.dream.domain.AdviceAndLuck;
import dsko.hier.fortune.dream.domain.DreamAnalysis;
import dsko.hier.fortune.dream.domain.FortuneProspects;
import dsko.hier.fortune.dream.domain.Precautions;
import dsko.hier.fortune.dream.domain.PsychologicalAnalysis;
import dsko.hier.fortune.dream.domain.SpecialMessage;
import dsko.hier.fortune.dream.domain.SymbolInterpretation;
import dsko.hier.security.domain.User;

public record AIDreamResponse(
        String summary,
        SymbolInterpretation symbolInterpretation,
        PsychologicalAnalysis psychologicalAnalysis,
        FortuneProspects fortuneProspects,
        Precautions precautions,
        AdviceAndLuck adviceAndLuck,
        SpecialMessage specialMessage
) {
    public static DreamAnalysis toEntity(User user, AIDreamResponse aiDreamResponse) {
        return DreamAnalysis.builder()
                .user(user)
                .aiResponse(aiDreamResponse)
                .build();
    }
}
