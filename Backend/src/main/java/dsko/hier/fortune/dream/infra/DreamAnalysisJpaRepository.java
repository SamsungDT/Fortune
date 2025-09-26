package dsko.hier.fortune.dream.infra;

import dsko.hier.fortune.dream.domain.DreamAnalysis;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DreamAnalysisJpaRepository extends JpaRepository<DreamAnalysis, UUID> {
}
