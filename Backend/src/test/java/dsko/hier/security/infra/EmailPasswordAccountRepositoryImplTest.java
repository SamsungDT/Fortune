package dsko.hier.security.infra;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import dsko.hier.security.domain.EmailPasswordAccount;
import dsko.hier.security.domain.EmailPasswordAccountRepository;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRole;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EmailPasswordAccountRepositoryImplTest {

    @Mock
    private EmailPasswordAccountJpaRepository emailPasswordAccountJpaRepository;

    @InjectMocks
    private EmailPasswordAccountRepositoryImpl emailPasswordAccountRepository;

    @Test
    @DisplayName("이메일 비밀번호 계정 저장 성공")
    void save_success() {
        // Given
        User user = User.builder()
                .email("test@example.com")
                .nickname("testUser")
                .role(UserRole.USER)
                .build();

        EmailPasswordAccount account = EmailPasswordAccount.builder()
                .passwordHash("hashedPassword123")
                .user(user)
                .build();

        // When
        when(emailPasswordAccountJpaRepository.save(any(EmailPasswordAccount.class))).thenReturn(account);

        // Then
        EmailPasswordAccount savedAccount = emailPasswordAccountRepository.save(account);

        assertThat(savedAccount).isNotNull();
        assertThat(savedAccount.getEmail_password_account_id()).isEqualTo(account.getEmail_password_account_id());
        assertThat(savedAccount.getPasswordHash()).isEqualTo("hashedPassword123");
        assertThat(savedAccount.getUser()).isEqualTo(user);
    }
}