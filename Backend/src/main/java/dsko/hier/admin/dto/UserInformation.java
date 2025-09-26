package dsko.hier.admin.dto;

import dsko.hier.security.domain.BirthInfo;
import dsko.hier.security.domain.Sex;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRole;
import java.util.UUID;

public record UserInformation(
        UUID userId,
        String email,
        String name,
        Sex sex,
        BirthInfo birthInfo,
        UserRole role
) {
    public static UserInformation fromEntity(User user) {
        return new UserInformation(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getSex(),
                user.getBirthInfo(),
                user.getRole()
        );
    }
}
