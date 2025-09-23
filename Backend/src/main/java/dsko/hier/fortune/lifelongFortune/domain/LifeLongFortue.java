package dsko.hier.fortune.lifelongFortune.domain;

import static jakarta.persistence.FetchType.LAZY;
import static lombok.AccessLevel.PROTECTED;

import dsko.hier.global.domain.BaseTimeEntity;
import dsko.hier.security.domain.User;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class LifeLongFortue extends BaseTimeEntity {
    @Id
    private UUID id;

    // 운세의 주인을 나타내는 User 엔티티와의 일대일 관계
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Embedded
    private Personality personality;

    @Embedded
    private Wealth wealth;

    @Embedded
    private LoveAndMarriage loveAndMarriage;

    @Embedded
    private Career career;

    @Embedded
    private Health health;

    @Embedded
    private TurningPoints turningPoints;

    @Embedded
    private GoodLuck goodLuck;

    @Builder
    public LifeLongFortue(User user, Personality personality, Wealth wealth, LoveAndMarriage loveAndMarriage,
                          Career career, Health health, TurningPoints turningPoints, GoodLuck goodLuck) {
        this.user = user;
        this.personality = personality;
        this.wealth = wealth;
        this.loveAndMarriage = loveAndMarriage;
        this.career = career;
        this.health = health;
        this.turningPoints = turningPoints;
        this.goodLuck = goodLuck;
    }

}
