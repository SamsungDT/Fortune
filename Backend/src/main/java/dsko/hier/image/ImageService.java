package dsko.hier.image;

import static dsko.hier.global.exception.CustomExcpMsgs.IMAGE_TYPE_INVALID;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import dsko.hier.fortune.dto.ImageRequest;
import dsko.hier.fortune.dto.MultiImageRequest;
import dsko.hier.global.exception.CustomExceptions.ImageException;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ImageService {
    private final AmazonS3Client amazonS3;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    private static final long URL_EXPIRATION_TIME_MILLIS = 1000 * 60 * 5L; // 5분

    public Map<String, String> getPresignedUrlForSimple(ImageRequest request) {

        String originalFileName = request.fileName();
        String fileExtension = getFileExtension(originalFileName);
        String contentType = getContentType(fileExtension);
        log.info("contentType = {}", contentType);

        // Content-Type을 포함하여 PUT 요청 URL 생성
        GeneratePresignedUrlRequest generatePresignedUrlRequest = getGeneratePresignedPutUrlRequest(
                bucketName,
                createPath(fileExtension)
        );

        URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
        return Map.of("url", url.toString());
    }

    public Map<String, String> getPresignedUrlForMultiple(MultiImageRequest request) {
        List<String> originalFileNames = request.fileNames();

        if (originalFileNames.isEmpty()) {
            throw new IllegalArgumentException("파일 이름 리스트는 비어 있을 수 없습니다.");
        }

        Map<String, String> res = new HashMap<>();
        int index = 1;

        for (String originalFileName : originalFileNames) {
            String fileExtension = getFileExtension(originalFileName);
            String path = createPath(fileExtension);

            // Content-Type을 포함하여 PUT 요청 URL 생성
            GeneratePresignedUrlRequest generatePresignedUrlRequest = getGeneratePresignedPutUrlRequest(bucketName,
                    path);
            URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);
            res.put("url" + index, url.toString());
            index++;
        }

        return res;
    }

    public Map<String, String> getDeletePreSingedUrl(String fileName) {
        GeneratePresignedUrlRequest generatePresignedUrlRequest = getGeneratePresignedDeleteUrlRequest(bucketName,
                fileName);
        URL url = amazonS3.generatePresignedUrl(generatePresignedUrlRequest);

        return Map.of("url", url.toString());
    }

    /**
     * PUT 메서드용 Presigned URL 요청 객체 생성
     *
     * @param bucketName 버킷 이름
     * @param fileName   객체 키 (파일 경로)
     * @return GeneratePresignedUrlRequest 객체
     */
    private GeneratePresignedUrlRequest getGeneratePresignedPutUrlRequest(String bucketName, String fileName) {
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, fileName)
                .withMethod(HttpMethod.PUT)
                .withExpiration(getPresignedUrlExpiration());

        return request;
    }

    /**
     * DELETE 메서드용 Presigned URL 요청 객체 생성
     *
     * @param bucketName 버킷 이름
     * @param objectKey  객체 키 (파일 경로)
     * @return GeneratePresignedUrlRequest 객체
     */
    private GeneratePresignedUrlRequest getGeneratePresignedDeleteUrlRequest(String bucketName, String objectKey) {
        return new GeneratePresignedUrlRequest(bucketName, objectKey)
                .withMethod(HttpMethod.DELETE)
                .withExpiration(getPresignedUrlExpiration());
    }

    private Date getPresignedUrlExpiration() {
        Date expiration = new Date();
        expiration.setTime(expiration.getTime() + URL_EXPIRATION_TIME_MILLIS);
        return expiration;
    }

    /**
     * 고유한 파일명과 경로를 생성합니다.
     *
     * @param fileExtension 파일 확장자
     * @return "접두사/고유파일명.확장자" 형식의 경로
     */
    private String createPath(String fileExtension) {
        return UUID.randomUUID() + "." + fileExtension;
    }

    /**
     * 파일명에서 확장자만 추출
     *
     * @param fileName 원본 파일명
     * @return 유효한 확장자 (소문자로 변환), 유효하지 않으면 "png"
     */
    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < fileName.length() - 1) {
            String extension = fileName.substring(dotIndex + 1).toLowerCase();
            return isValidImageExtension(extension) ? extension : "png";
        }
        return "png";
    }

    /**
     * 파일 확장자에 맞는 Content-Type을 반환합니다.
     *
     * @param extension 파일 확장자
     * @return MIME 타입 문자열
     */
    private String getContentType(String extension) {
        if (extension.equals("jpg") || extension.equals("jpeg")) {
            return "image/jpeg";
        } else if (extension.equals("png")) {
            return "image/png";
        } else {
            throw new ImageException(IMAGE_TYPE_INVALID.getMessage());
        }
    }

    // 유효한 이미지 확장자인지 확인
    private boolean isValidImageExtension(String extension) {
        return extension != null
                && (
                extension.equals("png") ||
                        extension.equals("jpeg") ||
                        extension.equals("jpg")
        );
    }
}