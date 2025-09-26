package dsko.hier.fortune.total.domain;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 건강운
 */

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class Health {
    private String generalHealth;
    private String weakPoint;
    private String checkupReminder;
    private String recommendedExercise;
}