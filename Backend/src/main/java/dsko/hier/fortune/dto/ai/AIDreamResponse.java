package dsko.hier.fortune.dto.ai;

import dsko.hier.fortune.domain.dreamDomain.AdviceAndLuck;
import dsko.hier.fortune.domain.dreamDomain.DreamAnalysis;
import dsko.hier.fortune.domain.dreamDomain.FortuneProspects;
import dsko.hier.fortune.domain.dreamDomain.Precautions;
import dsko.hier.fortune.domain.dreamDomain.PsychologicalAnalysis;
import dsko.hier.fortune.domain.dreamDomain.SpecialMessage;
import dsko.hier.fortune.domain.dreamDomain.SymbolInterpretation;
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
