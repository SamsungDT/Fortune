package dsko.hier.image;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import dsko.hier.fortune.dto.ImageRequest;
import dsko.hier.fortune.dto.MultiImageRequest;
import dsko.hier.global.exception.CustomExceptions.ImageException;
import java.net.URI;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class ImageServiceTest {

    @Mock
    private AmazonS3Client amazonS3;

    @InjectMocks
    private ImageService imageService;

    private static final String BUCKET_NAME = "test-bucket";

    @BeforeEach
    void setUp() {
        // @Value 필드 모킹
        ReflectionTestUtils.setField(imageService, "bucketName", BUCKET_NAME);
    }

    @Test
    @DisplayName("단일 파일의 Presigned URL이 정상적으로 생성된다")
    void getPresignedUrlForSimple_success() throws Exception {
        // given
        ImageRequest request = new ImageRequest("test_image.jpeg");
        URL mockUrl = new URL("https://test-bucket.s3.amazonaws.com/test-path.jpeg");

        // mock
        when(amazonS3.generatePresignedUrl(any(GeneratePresignedUrlRequest.class))).thenReturn(mockUrl);

        // when
        Map<String, String> result = imageService.getPresignedUrlForSimple(request);

        // then
        assertNotNull(result);
        assertEquals(mockUrl.toString(), result.get("url"));

        // verify
        verify(amazonS3, times(1)).generatePresignedUrl(any(GeneratePresignedUrlRequest.class));
    }

    @Test
    @DisplayName("다중 파일의 Presigned URL이 정상적으로 생성된다")
    void getPresignedUrlForMultiple_success() throws Exception {
        // given
        MultiImageRequest request = new MultiImageRequest(List.of("image1.png", "image2.jpeg"));
        URL mockUrl1 = new URI("https://test-bucket.s3.amazonaws.com/path1.png").toURL();
        URL mockUrl2 = new URI("https://test-bucket.s3.amazonaws.com/path2.jpeg").toURL();

        // mock
        when(amazonS3.generatePresignedUrl(any(GeneratePresignedUrlRequest.class)))
                .thenReturn(mockUrl1)
                .thenReturn(mockUrl2);

        // when
        Map<String, String> result = imageService.getPresignedUrlForMultiple(request);

        // then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(mockUrl1.toString(), result.get("url1"));
        assertEquals(mockUrl2.toString(), result.get("url2"));

        // verify
        verify(amazonS3, times(2)).generatePresignedUrl(any(GeneratePresignedUrlRequest.class));
    }

    @Test
    @DisplayName("파일 이름 리스트가 비어 있으면 예외가 발생한다")
    void getPresignedUrlForMultiple_emptyList_throwsException() {
        // given
        MultiImageRequest request = new MultiImageRequest(Collections.emptyList());

        // when & then
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            imageService.getPresignedUrlForMultiple(request);
        });

        assertEquals("파일 이름 리스트는 비어 있을 수 없습니다.", exception.getMessage());
    }

    @Test
    @DisplayName("DELETE용 Presigned URL이 정상적으로 생성된다")
    void getDeletePreSingedUrl_success() throws Exception {
        // given
        String fileName = "test-delete.png";
        URL mockUrl = new URI("https://test-bucket.s3.amazonaws.com/test-delete.png").toURL();

        // mock
        when(amazonS3.generatePresignedUrl(any(GeneratePresignedUrlRequest.class)))
                .thenReturn(mockUrl);

        // when
        Map<String, String> result = imageService.getDeletePreSingedUrl(fileName);

        // then
        assertNotNull(result);
        assertEquals(mockUrl.toString(), result.get("url"));

        // verify
        verify(amazonS3, times(1)).generatePresignedUrl(any(GeneratePresignedUrlRequest.class));
    }

    @Test
    @DisplayName("확장자가 없는 파일명에 대해 getFileExtension()은 png를 반환한다")
    void getFileExtension_noExtension_returnsDefault() {
        // given
        String fileName = "no-extension-file";

        // when
        String extension = ReflectionTestUtils.invokeMethod(imageService, "getFileExtension", fileName);

        // then
        assertEquals("png", extension);
    }

    @Test
    @DisplayName("점(.)으로 시작하는 파일명에 대해 getFileExtension()은 png를 반환한다")
    void getFileExtension_dotFile_returnsDefault() {
        // given
        String fileName = ".dotfile";

        // when
        String extension = ReflectionTestUtils.invokeMethod(imageService, "getFileExtension", fileName);

        // then
        assertEquals("png", extension);
    }

    @Test
    @DisplayName("유효하지 않은 확장자에 대해 getFileExtension()은 png를 반환한다")
    void getFileExtension_invalidExtension_returnsDefault() {
        // given
        String fileName = "invalid.gif";

        // when
        String extension = ReflectionTestUtils.invokeMethod(imageService, "getFileExtension", fileName);

        // then
        assertEquals("png", extension);
    }

    @Test
    @DisplayName("유효하지 않은 확장자에 대해 getContentType()은 ImageExceptions을 반환한다")
    void getContentType_invalidExtension_returnsDefault() {
        // given
        String extension = "pdf";

        // when, then
        Assertions.assertThrows(
                ImageException.class,
                () -> {
                    ReflectionTestUtils.invokeMethod(imageService, "getContentType", extension);
                }
        );
    }

    @Test
    @DisplayName("유효하지 않은 이미지 확장자에 대해 isValidImageExtension()은 false를 반환한다")
    void isValidImageExtension_invalidExtension_returnsFalse() {
        // given
        String extension = "gif";

        // when
        boolean isValid = ReflectionTestUtils.invokeMethod(imageService, "isValidImageExtension", extension);

        // then
        assertEquals(false, isValid);
    }

    @Test
    @DisplayName("확장자가 없으면 isValidImageExtension()은 false를 반환한다")
    void isValidImageExtension_null_returnsFalse() {
        // given
        String extension = null;

        // when
        boolean isValid = ReflectionTestUtils.invokeMethod(imageService, "isValidImageExtension", extension);

        // then
        assertEquals(false, isValid);
    }
}