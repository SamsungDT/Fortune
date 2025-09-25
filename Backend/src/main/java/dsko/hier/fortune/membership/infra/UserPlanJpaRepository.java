package dsko.hier.fortune.membership.infra;

import dsko.hier.fortune.membership.domain.UserPlan;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPlanJpaRepository extends JpaRepository<UserPlan, UUID> {

    Optional<UserPlan> findByUserEmail(String email);

}
