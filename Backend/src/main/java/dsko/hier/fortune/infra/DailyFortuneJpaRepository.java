package dsko.hier.fortune.infra;

import dsko.hier.fortune.domain.dailyDomain.DailyFortune;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyFortuneJpaRepository extends JpaRepository<DailyFortune, Long> {
    Optional<DailyFortune> findByUserEmailAndCreatedAt(String userEmail, LocalDateTime today);

    List<DailyFortune> findAllByUserEmail(String username);
}
