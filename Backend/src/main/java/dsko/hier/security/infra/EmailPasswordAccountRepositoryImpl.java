package dsko.hier.security.infra;

import dsko.hier.security.domain.EmailPasswordAccount;
import dsko.hier.security.domain.EmailPasswordAccountRepository;
import dsko.hier.security.domain.User;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class EmailPasswordAccountRepositoryImpl implements EmailPasswordAccountRepository {

    private final EmailPasswordAccountJpaRepository emailPasswordAccountJpaRepository;

    @Override
    public EmailPasswordAccount save(EmailPasswordAccount account) {
        return emailPasswordAccountJpaRepository.save(account);
    }

    @Override
    public Optional<EmailPasswordAccount> findByUserEmail(String email) {
        return emailPasswordAccountJpaRepository.findByUserEmail(email);
    }
}
