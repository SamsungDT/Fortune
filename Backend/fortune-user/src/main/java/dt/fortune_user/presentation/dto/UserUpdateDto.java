package dt.fortune_user.presentation.dto;

public record UserUpdateDto(
        String name,
        String year,
        String month,
        String day,
        BirthTime birthTime
) {
}
