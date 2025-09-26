package dsko.hier.fortune.infra;

import dsko.hier.fortune.domain.totalDomain.TotalFortune;
import dsko.hier.fortune.domain.totalDomain.TotalFortuneRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TotalFortuneRepositoryImpl implements TotalFortuneRepository {

    private final TotalFortuneJpaRepository repository;

    @Override
    public TotalFortune save(TotalFortune totalFortune) {
        return repository.save(totalFortune);
    }

    @Override
    public Optional<TotalFortune> findByUserEmail(String userEmail) {
        return repository.findByUserEmail(userEmail);
    }
}
