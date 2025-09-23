package dsko.hier.security.infra;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRole;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserRepositoryImplTest {

    @Mock
    private UserJpaRepository userJpaRepository;

    @InjectMocks
    private UserRepositoryImpl userRepository;

    @Test
    @DisplayName("사용자 저장 성공")
    void save_user_success() {
        // Given
        User user = User.builder()
                .email("test@example.com")
                .nickname("testuser")
                .role(UserRole.USER)
                .build();

        when(userJpaRepository.save(any(User.class))).thenReturn(user);

        // When
        User savedUser = userRepository.save(user);

        // Then
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    @DisplayName("ID로 사용자 조회 성공")
    void findById_success() {
        // Given
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .email("test@example.com")
                .nickname("testuser")
                .role(UserRole.USER)
                .build();

        when(userJpaRepository.findById(userId)).thenReturn(Optional.of(user));

        // When
        Optional<User> foundUser = userRepository.findById(userId);

        // Then
        assertThat(foundUser).isPresent();
    }

    @Test
    @DisplayName("이메일로 사용자 조회 성공")
    void findByEmail_success() {
        // Given
        String email = "user@user.com";
        User user = User.builder()
                .email(email)
                .nickname("testuser")
                .role(UserRole.USER)
                .build();

        when(userJpaRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // When
        Optional<User> foundUser = userRepository.findByEmail(email);

        // Then
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getEmail()).isEqualTo(email);
    }

    @Test
    @DisplayName("이메일로 사용자 조회 실패 - 사용자 없음")
    void findByEmail_notFound() {
        // Given
        String email = "notExist@user.com";
        when(userJpaRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        Optional<User> foundUser = userRepository.findByEmail(email);

        // Then
        assertThat(foundUser).isNotPresent();
    }
}