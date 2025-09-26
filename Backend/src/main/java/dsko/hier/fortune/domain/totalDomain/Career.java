package dsko.hier.fortune.domain.totalDomain;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 사업운과 직업운
 */

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class Career {
    private String successfulFields;
    private String careerChangeAge;
    private String leadershipStyle;
    private String entrepreneurship;
}