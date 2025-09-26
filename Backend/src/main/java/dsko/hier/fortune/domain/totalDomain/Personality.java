package dsko.hier.fortune.domain.totalDomain;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 타고난 성격과 재능
 */

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class Personality {
    private String strength;
    private String talent;
    private String responsibility;
    private String empathy;
}