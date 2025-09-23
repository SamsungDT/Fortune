package dsko.hier.security.domain;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.UUID;
import static lombok.AccessLevel.PROTECTED;

import dsko.hier.global.domain.BaseTimeEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = PROTECTED)
public class EmailPasswordAccount extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = UUID)
    private UUID email_password_account_id;
    private String passwordHash;

    @OneToOne(fetch = LAZY) // User와 1:1 관계
    @JoinColumn(name = "user_id") // DB에서 외래키 컬럼 이름
    private User user;

    @Builder
    public EmailPasswordAccount(String passwordHash, User user) {
        this.passwordHash = passwordHash;
        this.user = user;
    }
}