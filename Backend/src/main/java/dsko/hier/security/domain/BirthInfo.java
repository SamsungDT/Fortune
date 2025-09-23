package dsko.hier.security.domain;

import static jakarta.persistence.EnumType.STRING;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Enumerated;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Embeddable
public class BirthInfo {

    private int birthYear;
    private int birthMonth;
    private int birthDay;

    @Enumerated(STRING)
    private BirthTime birthTime;

    @Builder
    public BirthInfo(int birthYear, int birthMonth, int birthDay, BirthTime birthTime) {
        this.birthYear = birthYear;
        this.birthMonth = birthMonth;
        this.birthDay = birthDay;
        this.birthTime = birthTime;
    }
}