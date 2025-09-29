package dsko.hier.fortune.dto.ai.dream.infra;

import dsko.hier.fortune.domain.dreamDomain.DreamAnalysis;
import dsko.hier.fortune.domain.dreamDomain.DreamAnalysisRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class DreamAnalysisRepositoryImpl implements DreamAnalysisRepository {

    private final DreamAnalysisJpaRepository repository;

    @Override
    public DreamAnalysis save(DreamAnalysis dreamAnalysis) {
        return repository.save(dreamAnalysis);
    }

    @Override
    public List<DreamAnalysis> findAllByUserEmail(String username) {
        return repository.findAllByUserEmail(username);
    }
}
