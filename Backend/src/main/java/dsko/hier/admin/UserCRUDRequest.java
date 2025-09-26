package dsko.hier.admin;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UserCRUDRequest(
        @NotNull(message = "userId는 필수입니다.")
        UUID userId
) {
}
