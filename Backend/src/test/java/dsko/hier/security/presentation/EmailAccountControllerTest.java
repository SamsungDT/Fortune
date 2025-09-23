package dsko.hier.security.presentation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import dsko.hier.security.dto.request.EmailAndPassword;
import dsko.hier.security.dto.request.EmailCheckDto;
import dsko.hier.security.dto.request.EmailSignUpDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest // 전체 애플리케이션 컨텍스트를 로드합니다.
@Transactional // 테스트 후 DB 롤백을 보장합니다.
class EmailAccountControllerTest {

    private final String BASE_URL = "/api/security/email";

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .build();
    }

    @Test
    @DisplayName("[회원가입:성공] 이메일로 회원가입 요청 시 성공적으로 처리한다")
    void signUpViaEmailAndPassword_success() throws Exception {
        // Given
        EmailSignUpDto requestDto = new EmailSignUpDto("test@example.com", "testuser", "password123");

        // When & Then
        mockMvc.perform(post(BASE_URL + "/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").exists());
    }

    @Test
    @DisplayName("[이메일 중복 체크] : 중복된 이메일이 없으면 200 OK와 true 반환")
    void checkEmailNotDuplicate_success_with_true() throws Exception {
        // Given
        EmailCheckDto emailCheckDto = new EmailCheckDto("unique@test.com");

        // When & Then
        mockMvc.perform(post(BASE_URL + "/check-email")
                        .content(objectMapper.writeValueAsString(emailCheckDto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.data").value(true))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("[이메일 중복 체크] : 중복된 이메일이 있으면 200 OK와 false 반환")
    void checkEmailNotDuplicate_success_but_false() throws Exception {
        // Given
        String email = "notUnique@test.com";

        EmailSignUpDto requestDto = new EmailSignUpDto(email, "testuser", "password123");
        mockMvc.perform(post(BASE_URL + "/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestDto)));

        EmailCheckDto emailCheckDto = new EmailCheckDto(email);

        // When & Then
        mockMvc.perform(post(BASE_URL + "/check-email")
                        .content(objectMapper.writeValueAsString(emailCheckDto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.data").value(false))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("[로그인:성공] 이메일과 비밀번호로 로그인 요청 시 성공적으로 처리한다")
    void loginWithEmailAndPassword_success() throws Exception {
        // Given
        String email = "test@test.com";
        String password = "password123";

        EmailSignUpDto signUpDto = new EmailSignUpDto(email, password, "testuser");

        mockMvc.perform(post(BASE_URL + "/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpDto)))
                .andExpect(status().isOk());

        // When & Then
        EmailAndPassword emailAndPassword = new EmailAndPassword(email, password);
        mockMvc.perform(post(BASE_URL + "/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emailAndPassword)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.refreshToken").exists());
    }
}