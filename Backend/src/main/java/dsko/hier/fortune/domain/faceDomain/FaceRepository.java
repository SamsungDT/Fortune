package dsko.hier.fortune.domain.faceDomain;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FaceRepository {
    Face save(Face entity);

    List<Face> findAllByUserEmail(String username);

    Optional<Face> findById(UUID resultId);
}
