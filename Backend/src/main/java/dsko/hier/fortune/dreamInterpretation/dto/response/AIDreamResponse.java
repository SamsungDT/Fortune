package dsko.hier.fortune.dreamInterpretation.dto.response;

import dsko.hier.fortune.dreamInterpretation.domain.AdviceAndLuck;
import dsko.hier.fortune.dreamInterpretation.domain.FortuneProspects;
import dsko.hier.fortune.dreamInterpretation.domain.Precautions;
import dsko.hier.fortune.dreamInterpretation.domain.PsychologicalAnalysis;
import dsko.hier.fortune.dreamInterpretation.domain.SpecialMessage;
import dsko.hier.fortune.dreamInterpretation.domain.SymbolInterpretation;

public record AIDreamResponse(
        String summary,
        SymbolInterpretation symbolInterpretation,
        PsychologicalAnalysis psychologicalAnalysis,
        FortuneProspects fortuneProspects,
        Precautions precautions,
        AdviceAndLuck adviceAndLuck,
        SpecialMessage specialMessage
) {
}
