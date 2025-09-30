package dsko.hier.security.domain;

import static jakarta.persistence.EnumType.STRING;
import static jakarta.persistence.GenerationType.UUID;
import static lombok.AccessLevel.PROTECTED;

import dsko.hier.fortune.domain.dailyDomain.DailyFortune;
import dsko.hier.fortune.domain.dreamDomain.DreamAnalysis;
import dsko.hier.fortune.domain.faceDomain.Face;
import dsko.hier.fortune.domain.totalDomain.TotalFortune;
import dsko.hier.global.domain.BaseTimeEntity;
import dsko.hier.membership.domain.UserPlan;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity(name = "users")
@NoArgsConstructor(access = PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = UUID)
    private UUID id;

    @NotNull
    @Column(unique = true, nullable = false)
    private String email;

    @NotNull
    private String name;

    @Enumerated(STRING)
    @NotNull
    private Sex sex;

    @NotNull
    @Enumerated(STRING)
    private UserRole role;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private EmailPasswordAccount account;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserPlan userPlan;

    @OneToOne(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private TotalFortune totalFortune;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<DailyFortune> dailyFortunes = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Face> faces = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<DreamAnalysis> dreamAnalyses = new ArrayList<>();

    @NotNull
    @Embedded // BirthInfo를 값 타입으로 포함
    private BirthInfo birthInfo;

    @Builder
    public User(String email, String nickname, Sex sex, UserRole role, BirthInfo birthInfo) {
        this.email = email;
        this.name = nickname;
        this.sex = sex;
        this.role = role;
        this.birthInfo = birthInfo;
    }
}