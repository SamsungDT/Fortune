package dsko.hier.fortune.lifelongFortune.domain;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 재물운
 */

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class Wealth {
    private String twenties;
    private String thirties;
    private String forties;
    private String fiftiesAndBeyond;
}
