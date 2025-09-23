package dsko.hier.security.application;

import dsko.hier.security.domain.EmailPasswordAccount;
import dsko.hier.security.domain.EmailPasswordAccountRepository;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRepository;
import dsko.hier.security.domain.UserRole;
import dsko.hier.security.dto.request.EmailSignUpDto;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SignUpService {

    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final EmailPasswordAccountRepository emailPasswordAccountRepository;

    public UUID signUp(EmailSignUpDto req) {
        //1. User(간단한 정보) 생성
        User savedSimpleUser = userRepository.save(
                User.builder()
                        .email(req.email())
                        .nickname(req.nickname())
                        .role(UserRole.USER)
                        .build()
        );

        //2. EmailPasswordAccount 생성
        return emailPasswordAccountRepository.save(
                EmailPasswordAccount.builder()
                        .user(savedSimpleUser)
                        .passwordHash(encodePassword(req.password()))
                        .build()
        ).getEmail_password_account_id();
    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public boolean isDuplicateEmail(String email) {
        return !userRepository.findByEmail(email).isPresent();
    }
}
