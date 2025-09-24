package dsko.hier.fortune.face.application;

import dsko.hier.fortune.face.domain.Advice;
import dsko.hier.fortune.face.domain.Eye;
import dsko.hier.fortune.face.domain.Mouth;
import dsko.hier.fortune.face.domain.Nose;
import dsko.hier.fortune.face.domain.OverallImpression;

public record AIFaceAnalyzeResult(
        OverallImpression overallImpression,
        Eye eye,
        Nose nose,
        Mouth mouth,
        Advice advice
) {
}
