package dt.fortune_user.domain;

import static jakarta.persistence.EnumType.STRING;
import static lombok.AccessLevel.PROTECTED;

import dt.fortune_user.presentation.dto.BirthTime;
import dt.fortune_user.presentation.dto.UserUpdateDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(name = "unique_email", columnNames = "email")
})
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    UUID id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String role;

    private String birthYear;
    private String birthMonth;
    private String birthDay;

    @Enumerated(STRING)
    private BirthTime birthTime;


    private boolean enabled = true;


    public User(String name, String email, String password, String role, String year, String month, String birthDay,
                BirthTime birthTime) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.birthYear = year;
        this.birthMonth = month;
        this.birthDay = birthDay;
        this.birthTime = birthTime;
    }

    @Builder
    public static User create(String name, String email, String password, String role, String year, String month,
                              String day,
                              BirthTime birthTime) {
        return new User(name, email, password, role, year, month, day, birthTime);
    }

    public void update(UserUpdateDto dto) {
        if (dto.name() != null && !dto.name().equals(this.name)) {
            this.name = dto.name();
        }
        if (dto.year() != null && !dto.year().equals(this.birthYear)) {
            this.birthYear = dto.year();
        }
        if (dto.month() != null && !dto.month().equals(this.birthMonth)) {
            this.birthMonth = dto.month();
        }
        if (dto.day() != null && !dto.day().equals(this.birthDay)) {
            this.birthDay = dto.day();
        }
        if (dto.birthTime() != null && !dto.birthTime().equals(this.birthTime)) {
            this.birthTime = dto.birthTime();
        }
    }
}
