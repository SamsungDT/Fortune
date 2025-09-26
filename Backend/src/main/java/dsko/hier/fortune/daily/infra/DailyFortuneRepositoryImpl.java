package dsko.hier.fortune.daily.infra;

import dsko.hier.fortune.daily.domain.DailyFortune;
import dsko.hier.fortune.daily.domain.DailyFortuneRepository;
import java.time.LocalDate;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class DailyFortuneRepositoryImpl implements DailyFortuneRepository {

    private final DailyFortuneJpaRepository repository;

    @Override
    public DailyFortune save(DailyFortune dailyFortune) {
        return repository.save(dailyFortune);
    }

    @Override
    public Optional<DailyFortune> findByFortuneDateAndUserEmail(LocalDate today, String userEmail) {
        return repository.findByFortuneDateAndUserEmail(today, userEmail);
    }
}
