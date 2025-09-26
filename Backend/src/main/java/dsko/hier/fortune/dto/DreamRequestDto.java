package dsko.hier.fortune.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record DreamRequestDto(
        @NotNull(message = "꿈에 대한 설명은 필수입니다.")
        String dreamDescription,

        @NotNull(message = "꿈의 분위기는 필수입니다.")
        String dreamAtmosphere,

        @Nullable
        List<DeramKeyword> keywords
) {
}