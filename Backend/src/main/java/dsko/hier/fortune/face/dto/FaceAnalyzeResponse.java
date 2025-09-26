package dsko.hier.fortune.face.dto;

import dsko.hier.fortune.face.domain.Advice;
import dsko.hier.fortune.face.domain.Eye;
import dsko.hier.fortune.face.domain.Face;
import dsko.hier.fortune.face.domain.Mouth;
import dsko.hier.fortune.face.domain.Nose;
import dsko.hier.fortune.face.domain.OverallImpression;

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
