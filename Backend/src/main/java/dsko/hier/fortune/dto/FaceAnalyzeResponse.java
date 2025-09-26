package dsko.hier.fortune.dto;

import dsko.hier.fortune.domain.faceDomain.Advice;
import dsko.hier.fortune.domain.faceDomain.Eye;
import dsko.hier.fortune.domain.faceDomain.Face;
import dsko.hier.fortune.domain.faceDomain.Mouth;
import dsko.hier.fortune.domain.faceDomain.Nose;
import dsko.hier.fortune.domain.faceDomain.OverallImpression;

public record FaceAnalyzeResponse(
        OverallImpression overallImpression,
        Eye eye,
        Nose nose,
        Mouth mouth,
        Advice advice
) {
    public static FaceAnalyzeResponse fromEntity(Face face) {

        return new FaceAnalyzeResponse(
                face.getOverallImpression(),
                face.getEye(),
                face.getNose(),
                face.getMouth(),
                face.getAdvice()
        );
    }
}
