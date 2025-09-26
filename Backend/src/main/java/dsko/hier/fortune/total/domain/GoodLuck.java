package dsko.hier.fortune.total.domain;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 개운법
 */

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class GoodLuck {
    private String luckyColors;
    private String luckyNumbers;
    private String luckyDirection;
    private String goodDays;
    private String avoidances;
}