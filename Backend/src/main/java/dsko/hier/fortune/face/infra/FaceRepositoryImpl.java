package dsko.hier.fortune.face.infra;

import dsko.hier.fortune.face.domain.Face;
import dsko.hier.fortune.face.domain.FaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class FaceRepositoryImpl implements FaceRepository {

    private final FaceJpaRepository repository;

    @Override
    public Face save(Face entity) {
        return repository.save(entity);
    }
}
