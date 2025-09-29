package dsko.hier.fortune.domain.totalDomain;

import java.util.List;
import java.util.Optional;

public interface TotalFortuneRepository {
    TotalFortune save(TotalFortune totalFortune);

    Optional<TotalFortune> findByUserEmail(String userEmail);

    List<TotalFortune> findAllByUserEmail(String username);
}
