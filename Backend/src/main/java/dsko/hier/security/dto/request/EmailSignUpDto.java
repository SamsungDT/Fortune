package dsko.hier.security.dto.request;

import dsko.hier.security.domain.BirthTime;
import dsko.hier.security.domain.Sex;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record EmailSignUpDto(
        @NotNull(message = "이메일은 필수 입력 값입니다.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        String email,

        @NotNull(message = "비밀번호는 필수 입력 값입니다.")
        String password,

        @NotNull(message = "이름은 필수 입력 값입니다.")
        String name,

        @NotNull(message = "성별은 필수 입력 값입니다.")
        Sex sex,

        @NotNull(message = "출생 연도는 필수 입력 값입니다.")
        int birthYear,

        @NotNull(message = "출생 월은 필수 입력 값입니다.")
        int birthMonth,

        @NotNull(message = "출생일은 필수 입력 값입니다.")
        int birthDay,

        @NotNull(message = "출생 시간대는 필수 입력 값입니다.")
        BirthTime birthTime
) {
}