package dsko.hier.fortune.todayfortune.infra;

import dsko.hier.fortune.todayfortune.domain.DailyFortune;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyFortuneJpaRepository extends JpaRepository<DailyFortune, Long> {
    Optional<DailyFortune> findByFortuneDateAndUserEmail(LocalDate today, String userEmail);
}
