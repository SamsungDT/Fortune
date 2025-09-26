package dsko.hier.fortune.dto;

import dsko.hier.fortune.domain.dreamDomain.AdviceAndLuck;
import dsko.hier.fortune.domain.dreamDomain.DreamAnalysis;
import dsko.hier.fortune.domain.dreamDomain.FortuneProspects;
import dsko.hier.fortune.domain.dreamDomain.Precautions;
import dsko.hier.fortune.domain.dreamDomain.PsychologicalAnalysis;
import dsko.hier.fortune.domain.dreamDomain.SpecialMessage;
import dsko.hier.fortune.domain.dreamDomain.SymbolInterpretation;
import lombok.Builder;

@Builder
public record DreamResponse(
        String summary,
        SymbolInterpretation symbolInterpretation,
        PsychologicalAnalysis psychologicalAnalysis,
        FortuneProspects fortuneProspects,
        Precautions precautions,
        AdviceAndLuck adviceAndLuck,
        SpecialMessage specialMessage
) {
    public static DreamResponse fromEntity(DreamAnalysis dreamAnalysis) {
        return DreamResponse.builder()
                .summary(dreamAnalysis.getSummary())
                .symbolInterpretation(dreamAnalysis.getSymbolInterpretation())
                .psychologicalAnalysis(dreamAnalysis.getPsychologicalAnalysis())
                .fortuneProspects(dreamAnalysis.getFortuneProspects())
                .precautions(dreamAnalysis.getPrecautions())
                .adviceAndLuck(dreamAnalysis.getAdviceAndLuck())
                .specialMessage(dreamAnalysis.getSpecialMessage())
                .build();
    }
}
