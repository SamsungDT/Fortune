package dt.fortune_user.presentation.dto;

import java.util.UUID;

public record UserRespDto(
        UUID id,
        String name,
        String email,
        String year,
        String month,
        String day,
        BirthTime birthTime
) {
}
