package dt.fortune_user.application;

import dt.fortune_user.domain.CustomUserDetails;
import dt.fortune_user.domain.User;
import dt.fortune_user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User entity = userRepository.findByEmail(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with email: " + username)
        );
        return new CustomUserDetails(entity);
    }

}