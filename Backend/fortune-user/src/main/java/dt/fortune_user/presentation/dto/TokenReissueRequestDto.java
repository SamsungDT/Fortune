package dt.fortune_user.presentation.dto;

import jakarta.validation.constraints.NotBlank;

public record TokenReissueRequestDto(
        @NotBlank
        String refreshToken
) {
}
