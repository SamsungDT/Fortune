package dsko.hier.security.infra;

import dsko.hier.security.domain.EmailPasswordAccount;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailPasswordAccountJpaRepository extends JpaRepository<EmailPasswordAccount, UUID> {
    @EntityGraph(attributePaths = {"user", "user.userPlan"})
    Optional<EmailPasswordAccount> findByUserEmail(String email);
}
