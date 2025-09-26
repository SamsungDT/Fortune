package dsko.hier.fortune.domain.faceDomain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class Advice {

    @Column(nullable = false)
    private String keyword;

    @Column(nullable = false)
    private String caution; // JSON 형식의 문자열로 저장

    @Column(nullable = false)
    private String mainAdvice;

    @Column(nullable = false)
    private String tomorrowHint;
}