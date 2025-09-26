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
    private String adviceList; // 쉼표로 구분된 조언 목록
}