package dsko.hier.security.infra;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRole;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

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

    @Test
    @DisplayName("전체 사용자 조회")
    void findAll_success() {
        // Given
        List<User> users = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            User tempUser = User.builder()
                    .email("test" + i + "@example.com")
                    .nickname("testuser")
                    .role(UserRole.USER)
                    .build();
            users.add(tempUser);
        }
        Pageable pageable = Pageable.ofSize(10);
        Page<User> userPage = new PageImpl<>(users, pageable, users.size());

        // When
        when(userJpaRepository.findAll(pageable)).thenReturn(userPage);
        Page<User> result = userRepository.findAll(pageable);

        // Then
        assertThat(result.getTotalElements()).isEqualTo(5);
        assertThat(result.getContent()).hasSize(5);
    }

    @Test
    @DisplayName("사용자가 존재하면 삭제가 성공한다.")
    void delete_user_success() {
        // Given
        User user = User.builder()
                .email("test@example.com")
                .nickname("testuser")
                .role(UserRole.USER)
                .build();

        // When, Then
        userRepository.delete(user);

        //then
        verify(userJpaRepository, times(1)).delete(user);
    }
}