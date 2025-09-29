package dsko.hier.fortune.domain.dreamDomain;

import java.util.List;

public interface DreamAnalysisRepository {
    DreamAnalysis save(DreamAnalysis dreamAnalysis);

    List<DreamAnalysis> findAllByUserEmail(String username);
}
