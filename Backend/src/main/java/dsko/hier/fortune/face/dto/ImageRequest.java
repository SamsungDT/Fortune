package dsko.hier.fortune.face.dto;

import jakarta.validation.constraints.NotNull;

public record ImageRequest(
        @NotNull(message = "파일 이름은 필수입니다.")
        String fileName
) {
}
