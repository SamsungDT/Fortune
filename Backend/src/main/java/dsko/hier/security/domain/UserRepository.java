package dsko.hier.security.domain;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserRepository {
    User save(User user);

    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    Page<User> findAll(Pageable pageable);

    void delete(User user);
}
