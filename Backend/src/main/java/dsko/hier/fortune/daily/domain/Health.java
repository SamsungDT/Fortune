package dsko.hier.fortune.daily.domain;

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
public class Health {
    @Column(name = "health_tip1", columnDefinition = "TEXT")
    private String tip1;
    @Column(name = "health_tip2", columnDefinition = "TEXT")
    private String tip2;
    @Column(name = "health_tip3", columnDefinition = "TEXT")
    private String tip3;
    @Column(name = "health_tip4", columnDefinition = "TEXT")
    private String tip4;
}
