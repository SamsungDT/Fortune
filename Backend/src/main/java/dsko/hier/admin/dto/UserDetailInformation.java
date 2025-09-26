package dsko.hier.admin.dto;

import dsko.hier.security.domain.BirthInfo;
import dsko.hier.security.domain.Sex;
import dsko.hier.security.domain.UserRole;
import java.util.UUID;

public record UserDetailInformation(
        UUID userId,
        String email,
        String name,
        Sex sex,
        BirthInfo birthInfo,
        UserRole role,
        int remainingLimitCount,
        boolean isBlackList
) {
}
