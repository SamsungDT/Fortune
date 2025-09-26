package dsko.hier.fortune.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record MultiImageRequest(
        @NotNull(message = "파일 이름은 필수입니다.")
        List<String> fileNames
) {
}
