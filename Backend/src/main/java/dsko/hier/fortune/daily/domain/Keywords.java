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
public class Keywords {
    @Column(name = "lucky_colors")
    private String luckyColors;
    @Column(name = "lucky_numbers")
    private String luckyNumbers;
    @Column(name = "lucky_times")
    private String luckyTimes;
    @Column(name = "lucky_direction")
    private String luckyDirection;
    @Column(name = "good_foods")
    private String goodFoods;
}