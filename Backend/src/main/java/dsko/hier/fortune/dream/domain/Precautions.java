package dsko.hier.fortune.dream.domain;

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
public class Precautions {
    @Column(name = "precaution1", columnDefinition = "TEXT")
    private String precaution1;
    @Column(name = "precaution2", columnDefinition = "TEXT")
    private String precaution2;
    @Column(name = "precaution3", columnDefinition = "TEXT")
    private String precaution3;
}