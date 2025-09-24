package dsko.hier.fortune.dreamInterpretation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@Builder
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@AllArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class FortuneProspects {
    @Column(name = "short_term_outlook", columnDefinition = "TEXT")
    private String shortTermOutlook;
    @Column(name = "medium_term_outlook", columnDefinition = "TEXT")
    private String mediumTermOutlook;
    @Column(name = "long_term_outlook", columnDefinition = "TEXT")
    private String longTermOutlook;
}