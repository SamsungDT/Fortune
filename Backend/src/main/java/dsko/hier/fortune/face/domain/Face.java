package dsko.hier.fortune.face.domain;

import static jakarta.persistence.FetchType.LAZY;
import static lombok.AccessLevel.PROTECTED;

import dsko.hier.fortune.face.application.AIFaceAnalyzeResult;
import dsko.hier.global.domain.BaseTimeEntity;
import dsko.hier.security.domain.User;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class Face extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Embedded
    private OverallImpression overallImpression;

    @Embedded
    private Eye eye;

    @Embedded
    private Nose nose;

    @Embedded
    private Mouth mouth;

    @Embedded
    private Advice advice;

    public Face(User user, AIFaceAnalyzeResult aiResponse) {
        this.user = user;
        this.overallImpression = aiResponse.overallImpression();
        this.eye = aiResponse.eye();
        this.nose = aiResponse.nose();
        this.mouth = aiResponse.mouth();
        this.advice = aiResponse.advice();
    }
}