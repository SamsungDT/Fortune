package dsko.hier.security.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dsko.hier.security.domain.EmailPasswordAccount;
import dsko.hier.security.domain.EmailPasswordAccountRepository;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRepository;
import dsko.hier.security.domain.UserRole;
import dsko.hier.security.dto.request.EmailSignUpDto;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@ExtendWith(MockitoExtension.class)
class SignUpServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    EmailPasswordAccountRepository emailPasswordAccountRepository;

    @Mock
    BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    SignUpService signUpService;

    @Test
    @DisplayName("회원가입 성공 시, UUID 반환 및 저장 메서드가 호출된다")
    void signUp_success() {
        // Given
        EmailSignUpDto request = new EmailSignUpDto("test@example.com", "nickname", "password");

        // Mock 객체 및 예상 결과 설정
        User mockUser = User.builder()
                .email(request.email())
                .nickname(request.nickname())
                .role(UserRole.USER)
                .build();

        // save 메서드가 호출될 때 반환할 EmailPasswordAccount Mock 객체 생성
        EmailPasswordAccount mockAccount = EmailPasswordAccount.builder()
                .user(mockUser)
                .passwordHash("encodedPassword")
                .build();

        when(passwordEncoder.encode(any(String.class))).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(emailPasswordAccountRepository.save(any(EmailPasswordAccount.class))).thenReturn(mockAccount);

        // When
        signUpService.signUp(request); // UUID 반환값은 여기서 사용하지 않음 : JPA가 자동 생성해줌

        // Then
        verify(passwordEncoder, times(1)).encode(any(String.class));
        verify(userRepository, times(1)).save(any(User.class));
        verify(emailPasswordAccountRepository, times(1)).save(any(EmailPasswordAccount.class));
    }

    @Test
    @DisplayName("이메일 중복 체크 : 이메일 중복이 없으면 true 반환")
    void checkEmailNotDuplicate_success() {
        //Given
        String email = "unique@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        //When
        boolean isDuplicate = signUpService.isDuplicateEmail(email);

        //Then
        assertThat(isDuplicate).isTrue();
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    @DisplayName("이메일 중복 체크 : 이메일이 이미 존재하면 false 반환")
    void checkEmailDuplicate_failure() {
        String email = "duplicate@test.com";
        User existingUser = User.builder()
                .email(email)
                .nickname("existingUser")
                .role(UserRole.USER)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(existingUser));

        // When
        boolean isDuplicate = signUpService.isDuplicateEmail(email);

        // Then
        assertThat(isDuplicate).isFalse();
        verify(userRepository, times(1)).findByEmail(email);
    }
}