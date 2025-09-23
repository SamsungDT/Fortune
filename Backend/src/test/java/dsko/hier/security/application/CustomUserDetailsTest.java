package dsko.hier.security.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import dsko.hier.security.domain.EmailPasswordAccount;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRole;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsTest {

    @Mock
    private EmailPasswordAccount emailPasswordAccount;

    @Mock
    private User user;

    @Test
    @DisplayName("User, EmailPasswordAccount 정보를 기반으로 UserDetails를 올바르게 반환한다")
    void customUserDetails_should_return_correct_details() {
        // Given
        String expectedEmail = "testuser@example.com";
        String expectedPasswordHash = "hashedPassword123";
        UserRole expectedRole = UserRole.USER;

        // Mock 객체들의 동작 정의
        when(emailPasswordAccount.getUser()).thenReturn(user);
        when(emailPasswordAccount.getPasswordHash()).thenReturn(expectedPasswordHash);
        when(user.getEmail()).thenReturn(expectedEmail);
        when(user.getRole()).thenReturn(expectedRole);

        // When
        CustomUserDetails customUserDetails = new CustomUserDetails(emailPasswordAccount);

        // Then
        // getUsername() 메서드 검증
        assertThat(customUserDetails.getUsername()).isEqualTo(expectedEmail);

        // getPassword() 메서드 검증
        assertThat(customUserDetails.getPassword()).isEqualTo(expectedPasswordHash);

        // getAuthorities() 메서드 검증
        Collection<? extends GrantedAuthority> authorities = customUserDetails.getAuthorities();
        assertThat(authorities).hasSize(1);
        GrantedAuthority authority = authorities.iterator().next();
        assertThat(authority.getAuthority()).isEqualTo("ROLE_" + expectedRole.name());
    }


    @Test
    @DisplayName("is... 메서드들이 모두 true를 반환한다")
    void customUserDetails_should_return_true_for_isMethods() {
        // Given
        CustomUserDetails customUserDetails = new CustomUserDetails(emailPasswordAccount);

        // Then
        assertThat(customUserDetails.isAccountNonExpired()).isTrue();
        assertThat(customUserDetails.isAccountNonLocked()).isTrue();
        assertThat(customUserDetails.isCredentialsNonExpired()).isTrue();
        assertThat(customUserDetails.isEnabled()).isTrue();
    }
}