package dsko.hier.fortune.dream.infra;

import dsko.hier.fortune.dream.domain.DreamAnalysis;
import dsko.hier.fortune.dream.domain.DreamAnalysisRepository;
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
}
