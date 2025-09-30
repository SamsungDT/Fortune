package dsko.hier.fortune.infra;

import dsko.hier.fortune.domain.dreamDomain.DreamAnalysis;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DreamAnalysisJpaRepository extends JpaRepository<DreamAnalysis, UUID> {
    List<DreamAnalysis> findAllByUserEmail(String username);
}
