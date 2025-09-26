package dsko.hier.fortune.infra;

import dsko.hier.fortune.domain.totalDomain.TotalFortune;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TotalFortuneJpaRepository extends JpaRepository<TotalFortune, UUID> {
    Optional<TotalFortune> findByUserEmail(String userEmail);
}
