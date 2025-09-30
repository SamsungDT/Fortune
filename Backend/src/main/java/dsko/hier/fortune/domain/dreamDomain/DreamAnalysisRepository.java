package dsko.hier.fortune.domain.dreamDomain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DreamAnalysisRepository {
    DreamAnalysis save(DreamAnalysis dreamAnalysis);

    List<DreamAnalysis> findAllByUserEmail(String username);

    Optional<DreamAnalysis> findById(UUID resultId);
}
