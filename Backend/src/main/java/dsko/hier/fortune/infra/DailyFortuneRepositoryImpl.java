package dsko.hier.fortune.infra;

import dsko.hier.fortune.domain.dailyDomain.DailyFortune;
import dsko.hier.fortune.domain.dailyDomain.DailyFortuneRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class DailyFortuneRepositoryImpl implements DailyFortuneRepository {

    private final DailyFortuneJpaRepository repository;
    private final DailyFortuneQueryDsl dailyFortuneQueryDsl;

    @Override
    public DailyFortune save(DailyFortune dailyFortune) {
        return repository.save(dailyFortune);
    }

    @Override
    public Optional<DailyFortune> findByFortuneDateAndUserEmail(String userEmail, LocalDateTime today) {
        return dailyFortuneQueryDsl.findByUserEmailAndCreatedAt(userEmail, today);
    }

    @Override
    public List<DailyFortune> findAllByUserEmail(String username) {
        return repository.findAllByUserEmail(username);
    }
}
