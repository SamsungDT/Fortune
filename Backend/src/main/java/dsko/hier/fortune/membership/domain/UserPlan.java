package dsko.hier.fortune.membership.domain;

import static jakarta.persistence.EnumType.STRING;
import static jakarta.persistence.GenerationType.UUID;
import static lombok.AccessLevel.PROTECTED;

import dsko.hier.global.domain.BaseTimeEntity;
import dsko.hier.global.exception.CustomExceptions;
import dsko.hier.global.exception.CustomExcpMsgs;
import dsko.hier.security.domain.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class UserPlan extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(STRING)
    private PlanType planType;

    private int freeFortuneCount;

    private LocalDateTime planStartDate;

    private LocalDateTime planEndDate;

    public static UserPlan of(User user, PlanType planType) {
        UserPlan userPlan = new UserPlan();
        userPlan.user = user;
        userPlan.planType = planType;
        userPlan.freeFortuneCount = planType == PlanType.FREE ? 3 : Integer.MAX_VALUE; // 무료 플랜은 3회, 유료 플랜은 무제한
        userPlan.planStartDate = LocalDateTime.now();
        userPlan.planEndDate = LocalDateTime.now().plusYears(100); // 사실상 무제한 -> 차후 변경.
        return userPlan;
    }

    public void decreaseFreeFortuneCount() {
        if (this.planType != PlanType.FREE || this.freeFortuneCount <= 0) {
            throw new CustomExceptions.UserPlanException(CustomExcpMsgs.FREE_FORTUNE_COUNT_EXCEEDED.getMessage());
        }

        freeFortuneCount--;
    }
}
