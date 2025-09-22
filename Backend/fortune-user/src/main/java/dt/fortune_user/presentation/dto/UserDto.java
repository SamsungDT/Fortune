package dt.fortune_user.presentation.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record UserDto(
        @NotNull(message = "사용자 이름은 필수입니다.")
        String name,
        @NotNull(message = "이메일은 필수입니다.") @Email(message = "유효한 이메일 형식이 아닙니다.")
        String email,
        @NotNull(message = "비밀번호는 필수입니다.")
        String password,
        @NotNull(message = "생년은 필수입니다.")
        String year,
        @NotNull(message = "생월은 필수입니다.")
        String month,
        @NotNull(message = "생일은 필수입니다.")
        String day,
        @NotNull(message = "생시는 필수입니다.")
        BirthTime birthTime
) {
}
