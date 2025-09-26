package dsko.hier.fortune.total.domain;

import java.util.Optional;

public interface TotalFortuneRepository {
    TotalFortune save(TotalFortune totalFortune);

    Optional<TotalFortune> findByUserEmail(String userEmail);
}
