package dsko.hier.fortune.face.dto;

import dsko.hier.fortune.face.domain.ImageType;
import jakarta.validation.constraints.NotNull;

public record FaceAnalyzeRequest(
        @NotNull(message = "이미지 주소는 필수입니다")
        String imageUrl,

        @NotNull(message = "이미지 타입은 필수입니다")
        ImageType imageType
) {
}
