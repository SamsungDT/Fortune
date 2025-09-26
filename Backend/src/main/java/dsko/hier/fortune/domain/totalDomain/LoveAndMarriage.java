package dsko.hier.fortune.domain.totalDomain;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 연애운과 결혼운
 */

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class LoveAndMarriage {
    private String firstLove;
    private String marriageAge;
    private String spouseMeeting;
    private String marriedLife;
}