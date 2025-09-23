package dsko.hier.security.domain;

import java.util.Optional;

public interface EmailPasswordAccountRepository {
    EmailPasswordAccount save(EmailPasswordAccount account);

    Optional<EmailPasswordAccount> findByUserEmail(String email);
}
