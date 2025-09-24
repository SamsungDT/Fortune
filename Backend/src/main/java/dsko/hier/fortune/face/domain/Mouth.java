package dsko.hier.fortune.face.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class Mouth {

    @Column(nullable = false, name = "mouth_feature")
    private String feature;

}
