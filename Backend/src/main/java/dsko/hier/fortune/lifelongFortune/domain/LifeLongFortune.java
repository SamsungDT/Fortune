package dsko.hier.fortune.lifelongFortune.domain;

import static jakarta.persistence.FetchType.LAZY;
import static lombok.AccessLevel.PROTECTED;

import dsko.hier.fortune.lifelongFortune.dto.resposne.AILifelongFortuneResponse;
import dsko.hier.global.domain.BaseTimeEntity;
import dsko.hier.security.domain.User;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class LifeLongFortune extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // 운세의 주인을 나타내는 User 엔티티와의 일대일 관계
    @OneToOne(fetch = LAZY)
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

    public LifeLongFortune(User user, AILifelongFortuneResponse response) {
        this.user = user;
        this.personality = response.personality();
        this.wealth = response.wealth();
        this.loveAndMarriage = response.loveAndMarriage();
        this.career = response.career();
        this.health = response.health();
        this.turningPoints = response.turningPoints();
        this.goodLuck = response.goodLuck();
    }
}
