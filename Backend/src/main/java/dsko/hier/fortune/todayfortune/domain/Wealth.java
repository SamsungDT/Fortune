package dsko.hier.fortune.todayfortune.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 운세 상세 항목들은 @Embeddable 클래스로 분리
@Embeddable
@Getter
@Builder
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@AllArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class Wealth {
    @Column(name = "wealth_summary", columnDefinition = "TEXT")
    private String wealthSummary; // 예상치 못한 수입이 있을 수 있습니다.
    @Column(name = "wealth_tip1")
    private String wealthTip1; // 투자보다는 저축에 집중하는 것이 좋겠습니다.
    @Column(name = "wealth_tip2")
    private String wealthTip2; // 지출 계획을 세우고...
    @Column(name = "lotto_numbers")
    private String lottoNumbers; // 3, 17, 22, 35
}
