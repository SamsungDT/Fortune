package dsko.hier.fortune.domain.faceDomain;

import java.util.List;

public interface FaceRepository {
    Face save(Face entity);

    List<Face> findAllByUserEmail(String username);
}
