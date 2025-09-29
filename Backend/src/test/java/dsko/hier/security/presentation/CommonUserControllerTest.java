package dsko.hier.security.presentation;

import static org.springframework.restdocs.headers.HeaderDocumentation.headerWithName;
import static org.springframework.restdocs.headers.HeaderDocumentation.requestHeaders;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.documentationConfiguration;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import dsko.hier.global.exception.discord.DiscordService;
import dsko.hier.global.redis.RedisTokenService;
import dsko.hier.security.application.LoginService;
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
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.restdocs.RestDocumentationContextProvider;
import org.springframework.restdocs.RestDocumentationExtension;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ExtendWith({RestDocumentationExtension.class, SpringExtension.class}) // 이 부분 추가
class CommonUserControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LoginService loginService;

    @Autowired
    private RedisTokenService redisTokenService;

    @MockitoBean
    private DiscordService discordService;

    // 테스트용 사용자 정보
    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_PASSWORD = "password123";
    private String accessToken;
    private String refreshToken;

    @BeforeEach
    void setup(WebApplicationContext webApplicationContext, RestDocumentationContextProvider restDocumentation)
            throws Exception {
        // MockMvc 초기화에 Rest Docs 설정 적용
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(documentationConfiguration(restDocumentation))
                .build();

        // 사용자 생성 (회원가입)
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
        // 테스트 후 데이터베이스와 Redis 정리
        try {
            loginService.logout("Bearer " + this.refreshToken);
            redisTokenService.clearAll();
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
                .andExpect(status().isOk())
                .andDo(document("common-logout-success",
                        requestHeaders(
                                headerWithName(HttpHeaders.AUTHORIZATION).description("로그아웃을 위한 리프레시 토큰")
                        )
                ));
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
                .andExpect(jsonPath("$.data.refreshToken").isString())
                .andDo(document("common-refresh-success",
                        requestHeaders(
                                headerWithName(HttpHeaders.AUTHORIZATION).description("토큰 갱신을 위한 리프레시 토큰")
                        ),
                        responseFields(
                                fieldWithPath("code").description("응답 코드"),
                                fieldWithPath("message").description("응답 메시지"),
                                fieldWithPath("data.accessToken").description("새로 발급된 액세스 토큰"),
                                fieldWithPath("data.refreshToken").description("새로 발급된 리프레시 토큰")
                        )
                ));
    }
}