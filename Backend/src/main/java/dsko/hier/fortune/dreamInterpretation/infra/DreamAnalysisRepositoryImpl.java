package dsko.hier.fortune.dreamInterpretation.infra;

import dsko.hier.fortune.dreamInterpretation.domain.DreamAnalysis;
import dsko.hier.fortune.dreamInterpretation.domain.DreamAnalysisRepository;
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
