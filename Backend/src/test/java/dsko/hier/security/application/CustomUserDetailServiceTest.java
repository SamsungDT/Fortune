package dsko.hier.security.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import dsko.hier.security.domain.EmailPasswordAccount;
import dsko.hier.security.domain.EmailPasswordAccountRepository;
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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailServiceTest {

    @Mock
    private EmailPasswordAccountRepository emailPasswordAccountRepository;

    @InjectMocks
    private CustomUserDetailService customUserDetailService;

    @Test
    @DisplayName("이메일로 사용자를 성공적으로 로드하여 UserDetails를 반환한다")
    void loadUserByUsername_success() {
        // Given
        String userEmail = "test@example.com";
        User mockUser = User.builder().email(userEmail).role(UserRole.USER).build();
        EmailPasswordAccount mockAccount = EmailPasswordAccount.builder()
                .passwordHash("hashedPassword")
                .user(mockUser)
                .build();

        when(emailPasswordAccountRepository.findByUserEmail(userEmail)).thenReturn(Optional.of(mockAccount));

        // When
        UserDetails userDetails = customUserDetailService.loadUserByUsername(userEmail);

        // Then
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo(userEmail);
    }

    @Test
    @DisplayName("존재하지 않는 사용자 로드 시 UsernameNotFoundException 예외를 던진다")
    void loadUserByUsername_userNotFound() {
        // Given
        String nonExistentEmail = "nonexistent@example.com";
        when(emailPasswordAccountRepository.findByUserEmail(nonExistentEmail)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> customUserDetailService.loadUserByUsername(nonExistentEmail))
                .isInstanceOf(UsernameNotFoundException.class);
    }
}