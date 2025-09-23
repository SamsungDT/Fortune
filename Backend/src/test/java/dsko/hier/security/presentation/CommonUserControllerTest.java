package dsko.hier.security.presentation;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import dsko.hier.security.application.LoginService;
import dsko.hier.security.application.RedisService;
import dsko.hier.security.domain.BirthTime;
import dsko.hier.security.domain.Sex;
import dsko.hier.security.dto.request.EmailAndPassword;
import dsko.hier.security.dto.request.EmailSignUpDto;
import dsko.hier.security.dto.response.TokenResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CommonUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LoginService loginService;

    @Autowired
    private RedisService redisService;

    // 테스트용 사용자 정보
    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_PASSWORD = "password123";
    private String accessToken;
    private String refreshToken;

    @BeforeEach
    void setup() throws Exception {
        //사용자 생성 (회원가입)
        String testNickname = "tester";
        EmailSignUpDto emailSignUpDto = new EmailSignUpDto(TEST_EMAIL, TEST_PASSWORD, testNickname, Sex.FEMALE, 2001, 8,
                6, BirthTime.Sa);
        mockMvc.perform(post("/api/security/email/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emailSignUpDto)))
                .andExpect(status().isOk());

        // 로그인 요청
        EmailAndPassword loginRequest = new EmailAndPassword(TEST_EMAIL, TEST_PASSWORD);
        TokenResponse tokenResponse = loginService.emailAndPasswordLogin(loginRequest);

        log.info("Access Token: {}", tokenResponse.accessToken());
        log.info("Refresh Token: {}", tokenResponse.refreshToken());
        this.accessToken = tokenResponse.accessToken();
        this.refreshToken = tokenResponse.refreshToken();
    }

    @AfterEach
    void cleanup() {
        // 테스트 후 데이터베이스와 Redis를 정리합니다.
        // 실제 운영 환경에서는 테스트용 프로파일을 사용하여 데이터 정리 로직을 별도로 관리하는 것이 좋습니다.
        // 여기서는 로그아웃 엔드포인트를 통해 리프레시 토큰을 삭제하는 것으로 간주합니다.
        try {
            loginService.logout("Bearer " + this.refreshToken);
            redisService.clearAll(); // Redis 데이터 정리
        } catch (Exception e) {
            // 예외 발생 시 무시
        }
    }

    @Test
    @DisplayName("POST /api/security/common/logout - 로그아웃 요청이 성공해야 한다")
    void logout_success() throws Exception {
        // When
        mockMvc.perform(post("/api/security/common/logout")
                        .header("Authorization", "Bearer " + refreshToken)
                        .contentType(MediaType.APPLICATION_JSON))
                // Then
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/security/common/logout - 로그아웃 요청이 엑세스 토큰으로 하여도 성공해야 한다")
    void logout_success_with_AccessToken() throws Exception {
        // When
        mockMvc.perform(post("/api/security/common/logout")
                        .header("Authorization", "Bearer " + accessToken)
                        .contentType(MediaType.APPLICATION_JSON))
                // Then
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /api/security/common/logout - 로그아웃 요청이 잘못된 토큰과 함께 오면 실패해야 한다")
    void logout_failure_with_invalid_token() throws Exception {
        // When
        mockMvc.perform(post("/api/security/common/logout")
                        .header("Authorization", "Bearer " + "invalid_token")
                        .contentType(MediaType.APPLICATION_JSON))
                // Then
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/security/common/refresh - 토큰 갱신 요청이 성공해야 한다")
    void refresh_success() throws Exception {
        // When
        mockMvc.perform(post("/api/security/common/refresh")
                        .header("Authorization", "Bearer " + refreshToken)
                        .contentType(MediaType.APPLICATION_JSON))
                // Then
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").isString())
                .andExpect(jsonPath("$.data.refreshToken").isString());
    }
}