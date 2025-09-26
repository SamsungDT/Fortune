package dsko.hier.membership.application;

import dsko.hier.membership.domain.PlanType;
import dsko.hier.membership.domain.UserPlan;
import dsko.hier.membership.domain.UserPlanRepository;
import dsko.hier.security.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserPlanService {

    private final UserPlanRepository userPlanRepository;

    //UserPlan 을 회원가입 시 생성할 수 있도록 돕는 메서드
    public void createUserPlan(User user) {
        userPlanRepository.save(UserPlan.of(user, PlanType.FREE));
    }

    public boolean checkUserHaveRightIfHaveThenReduceCount(String email) {
        UserPlan userplan = userPlanRepository.findByUserEmail(email)
                .orElseThrow(
                        () -> new IllegalArgumentException("해당 사용자의 멤버쉽 정보를 찾을 수 없습니다: " + email)
                );

        if (!userplan.getPlanType().equals(PlanType.FREE) || userplan.getFreeFortuneCount() >= 0) {
            if (userplan.getPlanType().equals(PlanType.FREE)) {
                userplan.decreaseFreeFortuneCount();
            }
            return true;
        }

        return false;
    }
}
