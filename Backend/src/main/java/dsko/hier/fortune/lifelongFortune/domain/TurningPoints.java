package dsko.hier.fortune.lifelongFortune.domain;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 인생의 전환점
 *
 * @ElementCollection: 기본 타입이나 임베디드 타입의 컬렉션을 매핑할 때 사용
 */

@Getter
@Setter
@NoArgsConstructor
@Embeddable
public class TurningPoints {
    @ElementCollection
    private List<String> points;
}