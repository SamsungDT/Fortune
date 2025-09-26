package dsko.hier.security.application;

import dsko.hier.global.redis.RedisUserCountService;
import dsko.hier.membership.application.UserPlanService;
import dsko.hier.security.domain.BirthInfo;
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
    private final UserPlanService userPlanService;
    private final RedisUserCountService redisUserCountService;

    public UUID signUp(EmailSignUpDto req) {
        //0. BirthInfo 생성
        BirthInfo birthInfo = BirthInfo.builder()
                .birthDay(req.birthDay())
                .birthMonth(req.birthMonth())
                .birthYear(req.birthYear())
                .birthTime(req.birthTime())
                .build();

        //1. User(간단한 정보) 생성
        User savedSimpleUser = userRepository.save(
                User.builder()
                        .email(req.email())
                        .nickname(req.name())
                        .sex(req.sex())
                        .birthInfo(birthInfo)
                        .role(UserRole.USER)
                        .build()
        );

        //2. EmailPasswordAccount 생성
        UUID emailPasswordAccountId = emailPasswordAccountRepository.save(
                EmailPasswordAccount.builder()
                        .user(savedSimpleUser)
                        .passwordHash(encodePassword(req.password()))
                        .build()
        ).getEmail_password_account_id();

        //3. UserPlan 생성 (FREE)
        userPlanService.createUserPlan(savedSimpleUser);

        //4. 레디스에 사용자 수 1 증가
        log.info("레디스에 사용자 수 1 증가 시도");
        redisUserCountService.increment();
        log.info("레디스에 사용자 수 1 증가 시도 완료");

        return emailPasswordAccountId;
    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public boolean isDuplicateEmail(String email) {
        return !userRepository.findByEmail(email).isPresent();
    }
}
