package dsko.hier.fortune.dto.ai;

import dsko.hier.fortune.domain.faceDomain.Advice;
import dsko.hier.fortune.domain.faceDomain.Eye;
import dsko.hier.fortune.domain.faceDomain.Face;
import dsko.hier.fortune.domain.faceDomain.Mouth;
import dsko.hier.fortune.domain.faceDomain.Nose;
import dsko.hier.fortune.domain.faceDomain.OverallImpression;
import dsko.hier.security.domain.User;

public record AIFaceAnalyzeResult(
        OverallImpression overallImpression,
        Eye eye,
        Nose nose,
        Mouth mouth,
        Advice advice
) {
    public static Face toEntity(User user, AIFaceAnalyzeResult aiResponse) {
        return new Face(user, aiResponse);
    }
}
