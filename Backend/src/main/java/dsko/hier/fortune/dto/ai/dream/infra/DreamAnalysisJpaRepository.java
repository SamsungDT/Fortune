package dsko.hier.fortune.dto.ai.dream.infra;

import dsko.hier.fortune.domain.dreamDomain.DreamAnalysis;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DreamAnalysisJpaRepository extends JpaRepository<DreamAnalysis, UUID> {
}
