package dsko.hier.fortune.todayfortune.domain;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyFortuneRepository {
    DailyFortune save(DailyFortune dailyFortune);

    Optional<DailyFortune> findByFortuneDateAndUserEmail(LocalDate today, String userEmail);
}
