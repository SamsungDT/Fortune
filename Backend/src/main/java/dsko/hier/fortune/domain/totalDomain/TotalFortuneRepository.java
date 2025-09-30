package dsko.hier.fortune.domain.totalDomain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TotalFortuneRepository {
    TotalFortune save(TotalFortune totalFortune);

    Optional<TotalFortune> findByUserEmail(String userEmail);

    List<TotalFortune> findAllByUserEmail(String username);

    Optional<TotalFortune> findById(UUID resultId);
}
