package dsko.hier.fortune.lifelongFortune.infra;

import dsko.hier.fortune.lifelongFortune.domain.LifeLongFortune;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LifeLongFortuneJpaRepository extends JpaRepository<LifeLongFortune, UUID> {
}
