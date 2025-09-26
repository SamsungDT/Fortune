package dsko.hier.fortune.total.domain;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 인생의 전환점
 */

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class TurningPoints {
    private String ein;
    private String zwei;
    private String drei;
}