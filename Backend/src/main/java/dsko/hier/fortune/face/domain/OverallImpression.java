package dsko.hier.fortune.face.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class OverallImpression {

    @Column(nullable = false)
    private String overallImpression; // 전체적인 인상

    @Column(nullable = false)
    private String overallFortune; // 종합 운세

}