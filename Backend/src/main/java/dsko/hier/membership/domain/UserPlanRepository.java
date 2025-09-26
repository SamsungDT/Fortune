package dsko.hier.membership.domain;

import java.util.Optional;

public interface UserPlanRepository {
    UserPlan save(UserPlan entity);

    Optional<UserPlan> findByUserEmail(String email);
}
