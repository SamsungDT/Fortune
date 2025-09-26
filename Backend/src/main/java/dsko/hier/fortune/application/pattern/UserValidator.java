package dsko.hier.fortune.application.pattern;

import dsko.hier.global.exception.CustomExceptions.UserException;
import dsko.hier.global.exception.CustomExcpMsgs;
import dsko.hier.membership.application.UserPlanService;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * UserValidator는 사용자의 존재 여부를 확인하고, 사용자의 플랜을 검증하는 역할을 합니다. 이 클래스는 UserRepository와 UserPlanService를 주입받아 사용합니다.
 */

@Service
@RequiredArgsConstructor
@Transactional
public class UserValidator {

    private final UserRepository userRepository;
    private final UserPlanService userPlanService;

    public User validate(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UserException(CustomExcpMsgs.USER_NOT_FOUND.getMessage()));

        if (!userPlanService.checkUserHaveRightIfHaveThenReduceCount(user.getEmail())) {
            throw new UserException(CustomExcpMsgs.FREE_FORTUNE_COUNT_EXCEEDED.getMessage());
        }

        return user;
    }
}