package dsko.hier.admin.application;

import dsko.hier.admin.UserCRUDRequest;
import dsko.hier.admin.dto.AdminEmailSignUpDto;
import dsko.hier.admin.dto.UserDetailInformation;
import dsko.hier.admin.dto.UserInformation;
import dsko.hier.global.exception.CustomExceptions.UserException;
import dsko.hier.global.exception.CustomExcpMsgs;
import dsko.hier.global.redis.RedisTokenService;
import dsko.hier.global.redis.RedisUserCountService;
import dsko.hier.membership.application.UserPlanService;
import dsko.hier.membership.domain.PlanType;
import dsko.hier.security.domain.BirthInfo;
import dsko.hier.security.domain.EmailPasswordAccount;
import dsko.hier.security.domain.EmailPasswordAccountRepository;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRepository;
import dsko.hier.security.domain.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final EmailPasswordAccountRepository emailPasswordAccountRepository;
    private final UserPlanService userPlanService;
    private final RedisUserCountService redisUserCountService;
    private final RedisTokenService redisTokenService;

    public void signUpAsAdmin(AdminEmailSignUpDto req) {
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
                        .role(UserRole.ADMIN)
                        .build()
        );

        //2. EmailPasswordAccount 생성
        emailPasswordAccountRepository.save(
                EmailPasswordAccount.builder()
                        .user(savedSimpleUser)
                        .passwordHash(encodePassword(req.password()))
                        .build()
        );

        //3. UserPlan 생성 (FREE)
        userPlanService.createUserPlan(savedSimpleUser, PlanType.PREMIUM);

        //4. 레디스에 사용자 수 1 증가
        log.info("레디스에 사용자 수 1 증가 시도");
        redisUserCountService.increment();
        log.info("레디스에 사용자 수 1 증가 시도 완료");
    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public Page<UserInformation> getUsers(Pageable pageable) {
        Page<User> userPage = userRepository.findAll(pageable);

        return userPage.map(UserInformation::fromEntity);
    }

    public UserDetailInformation getUser(UserCRUDRequest req) {
        //1. 사용자 전체 정보 조회.
        User user = userRepository.findById(req.userId())
                .orElseThrow(
                        () -> new UserException(CustomExcpMsgs.USER_NOT_FOUND.getMessage())
                );

        //2. 사용자의 남은 무료 운세 카운트 조회.
        int freeFortuneCount = userPlanService.getRemainingFreeFortuneCount(user.getEmail());

        //3. 사용자가 블랙리스트에 포함되어 있는지 조회.
        boolean isInBlacklist = redisTokenService.isUserBlacklisted(user.getEmail());

        //4. UserDetailInfomation 생성 및 반환.
        UserDetailInformation userDetailInformation = new UserDetailInformation(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getSex(),
                user.getBirthInfo(),
                user.getRole(),
                freeFortuneCount,
                isInBlacklist
        );

        return userDetailInformation;
    }

    public void deleteUser(UserCRUDRequest req) {
        User user = userRepository.findById(req.userId())
                .orElseThrow(
                        () -> new UserException(CustomExcpMsgs.USER_NOT_FOUND.getMessage())
                );
        redisTokenService.deleteRefreshToken(user.getEmail());
        userRepository.delete(user);
    }

    public void expiredUserTokens(UserCRUDRequest req) {
        User user = userRepository.findById(req.userId())
                .orElseThrow(
                        () -> new UserException(CustomExcpMsgs.USER_NOT_FOUND.getMessage())
                );
        redisTokenService.deleteRefreshToken(user.getEmail());
    }

    public void addUserToBlacklist(UserCRUDRequest req) {
        User user = userRepository.findById(req.userId())
                .orElseThrow(
                        () -> new UserException(CustomExcpMsgs.USER_NOT_FOUND.getMessage())
                );
        redisTokenService.addTokenToBlacklist(user.getEmail(), 10000000000000L); // 영구 블랙리스트
    }

    public void addFreeFortuneCount(UserCRUDRequest req, int count) {
        User user = userRepository.findById(req.userId())
                .orElseThrow(
                        () -> new UserException(CustomExcpMsgs.USER_NOT_FOUND.getMessage())
                );
        userPlanService.addFreeFortuneCount(user.getEmail(), count);
    }
}
