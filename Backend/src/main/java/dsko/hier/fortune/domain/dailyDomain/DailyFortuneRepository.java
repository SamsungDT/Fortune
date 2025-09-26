package dsko.hier.fortune.domain.dailyDomain;

import java.time.LocalDateTime;
import java.util.Optional;

public interface DailyFortuneRepository {
    DailyFortune save(DailyFortune dailyFortune);

    Optional<DailyFortune> findByFortuneDateAndUserEmail(String userEmail, LocalDateTime today);
}
