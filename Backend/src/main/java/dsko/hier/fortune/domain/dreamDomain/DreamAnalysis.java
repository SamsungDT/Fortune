package dsko.hier.fortune.domain.dreamDomain;

import static jakarta.persistence.FetchType.LAZY;

import dsko.hier.fortune.dto.ai.AIDreamResponse;
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
@Table(name = "dream_analysis")
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class DreamAnalysis extends BaseTimeEntity {

    @Id
    @Column(name = "id", updatable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "summary", columnDefinition = "TEXT", nullable = false)
    private String summary;

    @Embedded
    private SymbolInterpretation symbolInterpretation;

    @Embedded
    private PsychologicalAnalysis psychologicalAnalysis;

    @Embedded
    private FortuneProspects fortuneProspects;

    @Embedded
    private Precautions precautions;

    @Embedded
    private AdviceAndLuck adviceAndLuck;

    @Embedded
    private SpecialMessage specialMessage;

    @Builder
    public DreamAnalysis(User user, AIDreamResponse aiResponse) {
        this.user = user;
        this.summary = aiResponse.summary();
        this.symbolInterpretation = aiResponse.symbolInterpretation();
        this.psychologicalAnalysis = aiResponse.psychologicalAnalysis();
        this.fortuneProspects = aiResponse.fortuneProspects();
        this.precautions = aiResponse.precautions();
        this.adviceAndLuck = aiResponse.adviceAndLuck();
        this.specialMessage = aiResponse.specialMessage();
    }
}