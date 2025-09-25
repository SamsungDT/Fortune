package dsko.hier.fortune.lifelongFortune.domain;

import java.util.Optional;

public interface LifeLongFortuneRepository {
    LifeLongFortune save(LifeLongFortune lifeLongFortune);

    Optional<LifeLongFortune> findByUserEmail(String userEmail);
}
