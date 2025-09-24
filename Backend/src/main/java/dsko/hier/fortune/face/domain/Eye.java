package dsko.hier.fortune.face.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 눈의 특징 엔티티
@Embeddable
@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
public class Eye {

    @Column(nullable = false, name = "eye_feature")
    private String feature; // 눈의 특징을 담는 필드
}

