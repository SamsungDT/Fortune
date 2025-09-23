package dsko.hier.fortune.lifelongFortune.domain;

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
    private String first;
    private String second;
    private String third;
}