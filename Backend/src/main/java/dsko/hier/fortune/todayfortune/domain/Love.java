package dsko.hier.fortune.todayfortune.domain;

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
public class Love {
    @Column(name = "love_single", columnDefinition = "TEXT")
    private String single;
    @Column(name = "love_in_relationship", columnDefinition = "TEXT")
    private String inRelationship;
    @Column(name = "love_married", columnDefinition = "TEXT")
    private String married;
}
