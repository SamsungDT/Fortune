package dsko.hier.fortune.total.infra;

import dsko.hier.fortune.total.domain.TotalFortune;
import dsko.hier.fortune.total.domain.TotalFortuneRepository;
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
