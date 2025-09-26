package dsko.hier.fortune.dream.dto.response;

import dsko.hier.fortune.dream.domain.AdviceAndLuck;
import dsko.hier.fortune.dream.domain.DreamAnalysis;
import dsko.hier.fortune.dream.domain.FortuneProspects;
import dsko.hier.fortune.dream.domain.Precautions;
import dsko.hier.fortune.dream.domain.PsychologicalAnalysis;
import dsko.hier.fortune.dream.domain.SpecialMessage;
import dsko.hier.fortune.dream.domain.SymbolInterpretation;
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
