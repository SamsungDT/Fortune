package dsko.hier.fortune.lifelongFortune.infra;

import dsko.hier.fortune.lifelongFortune.domain.LifeLongFortune;
import dsko.hier.fortune.lifelongFortune.domain.LifeLongFortuneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class LifeLongFortuneRepositoryImpl implements LifeLongFortuneRepository {

    private final LifeLongFortuneJpaRepository repository;

    @Override
    public LifeLongFortune save(LifeLongFortune lifeLongFortune) {
        return repository.save(lifeLongFortune);
    }
}
