package dsko.hier.fortune.face.infra;

import dsko.hier.fortune.face.domain.Face;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaceJpaRepository extends JpaRepository<Face, UUID> {
}
