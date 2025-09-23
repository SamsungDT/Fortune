package dsko.hier.security.application;

import dsko.hier.security.domain.EmailPasswordAccount;
import dsko.hier.security.domain.EmailPasswordAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final EmailPasswordAccountRepository emailPasswordAccountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        EmailPasswordAccount emailPasswordAccount = emailPasswordAccountRepository.findByUserEmail(username)
                .orElseThrow(
                        () -> new UsernameNotFoundException(
                                "EmailPasswordAccount not found for user with email: " + username)
                );
        return new CustomUserDetails(emailPasswordAccount);
    }
}
