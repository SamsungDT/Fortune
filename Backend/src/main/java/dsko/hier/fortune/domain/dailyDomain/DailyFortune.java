package dsko.hier.fortune.domain.dailyDomain;

import static jakarta.persistence.FetchType.LAZY;

import dsko.hier.fortune.dto.ai.AIDailyFortuneResponse;
import dsko.hier.global.domain.BaseTimeEntity;
import dsko.hier.security.domain.User;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "daily_fortune")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class DailyFortune extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "overall_rating", nullable = false)
    private int overallRating; // 별점 (1~5)

    @Column(name = "overall_summary", columnDefinition = "TEXT", nullable = false)
    private String overallSummary;

    @Embedded
    private Wealth fortuneWealth;

    @Embedded
    private Love fortuneLove;

    @Embedded
    private Career fortuneCareer;

    @Embedded
    private Health fortuneHealth;

    @Embedded
    private Keywords fortuneKeywords;

    @Embedded
    private Precautions fortunePrecautions;

    @Embedded
    private Advice fortuneAdvice;

    @Column(name = "tomorrow_preview", columnDefinition = "TEXT")
    private String tomorrowPreview;

    @Builder
    public DailyFortune(User user, AIDailyFortuneResponse resp) {
        this.user = user;
        this.overallRating = resp.overallRating();
        this.overallSummary = resp.overallSummary();
        this.fortuneWealth = resp.wealth();
        this.fortuneLove = resp.love();
        this.fortuneCareer = resp.career();
        this.fortuneHealth = resp.health();
        this.fortuneKeywords = resp.keywords();
        this.fortunePrecautions = resp.precautions();
        this.fortuneAdvice = resp.advice();
        this.tomorrowPreview = resp.tomorrowPreview();
    }
}