package dsko.hier.fortune.domain.dreamDomain;

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
public class AdviceAndLuck {
    @Column(name = "advice1", columnDefinition = "TEXT")
    private String advice1;
    @Column(name = "advice2", columnDefinition = "TEXT")
    private String advice2;
    @Column(name = "advice3", columnDefinition = "TEXT")
    private String advice3;
    @Column(name = "advice4", columnDefinition = "TEXT")
    private String advice4;
    @Column(name = "advice5", columnDefinition = "TEXT")
    private String advice5;
}