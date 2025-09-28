package dsko.hier.image;

import static org.mockito.BDDMockito.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import dsko.hier.fortune.dto.ImageRequest;
import dsko.hier.fortune.dto.MultiImageRequest;
import dsko.hier.global.redis.RedisTokenService;
import dsko.hier.security.application.CustomUserDetailService;
import dsko.hier.security.application.JwtTokenProvider;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ImageController.class)
class ImageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ImageService imageService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private RedisTokenService redisTokenService;

    @MockitoBean
    private CustomUserDetailService userDetailsService;

    @Test
    @WithMockUser(username = "testuser", roles = "USER")
    @DisplayName("단일 이미지 Presigned URL 요청 API가 정상 동작한다")
    void getPresignedUrl_success() throws Exception {
        // given
        ImageRequest request = new ImageRequest("test_image.png");
        String requestJson = objectMapper.writeValueAsString(request);
        Map<String, String> serviceResponse = Collections.singletonMap("url", "http://test-url/image.png");

        // mock
        given(imageService.getPresignedUrlForSimple(any(ImageRequest.class)))
                .willReturn(serviceResponse);

        // when & then
        mockMvc.perform(post("/api/fortune/face/picture")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("200"))
                .andExpect(jsonPath("$.data.url").value("http://test-url/image.png"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = "USER")
    @DisplayName("다중 이미지 Presigned URL 요청 API가 정상 동작한다")
    void getPresignedUrl_multiple_success() throws Exception {
        // given
        MultiImageRequest request = new MultiImageRequest(List.of("img1.png", "img2.jpeg"));
        String requestJson = objectMapper.writeValueAsString(request);
        Map<String, String> serviceResponse = Map.of(
                "url1", "http://test-url/img1.png",
                "url2", "http://test-url/img2.jpeg"
        );

        // mock
        given(imageService.getPresignedUrlForMultiple(any(MultiImageRequest.class)))
                .willReturn(serviceResponse);

        // when & then
        mockMvc.perform(post("/api/fortune/face/picture/multi")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("200"))
                .andExpect(jsonPath("$.data.url1").value("http://test-url/img1.png"))
                .andExpect(jsonPath("$.data.url2").value("http://test-url/img2.jpeg"));
    }

    @Test
    @WithMockUser(username = "testuser", roles = "USER")
    @DisplayName("파일 삭제 요청 API가 정상 동작한다")
    void deleteImage_success() throws Exception {
        // given
        String fileName = "image_to_delete.jpg";
        Map<String, String> serviceResponse = Collections.singletonMap("url", "http://test-url/image_to_delete.jpg");

        // mock
        given(imageService.getDeletePreSingedUrl(fileName)).willReturn(serviceResponse);

        // when & then
        mockMvc.perform(post("/api/fortune/face/picture/delete")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(fileName))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("200"))
                .andExpect(jsonPath("$.data.url").value("http://test-url/image_to_delete.jpg"));
    }
}