package dsko.hier.fortune.infra;

import dsko.hier.fortune.domain.faceDomain.Face;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaceJpaRepository extends JpaRepository<Face, UUID> {
    List<Face> findAllByUserEmail(String username);
}
