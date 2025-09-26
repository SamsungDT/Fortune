package dsko.hier.image;

import dsko.hier.fortune.dto.ImageRequest;
import dsko.hier.fortune.dto.MultiImageRequest;
import dsko.hier.global.response.APIResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "이미지",
        description = "이미지 관련 API"
)
@RestController
@RequestMapping("/api/fortune/face/picture")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping
    public APIResponse<Map<String, String>> getPresignedUrl(
            @Validated @RequestBody ImageRequest request) {
        return APIResponse.success(imageService.getPresignedUrlForSimple(request));
    }

    @PostMapping("/multi")
    public APIResponse<Map<String, String>> getPresignedUrl(
            @Validated @RequestBody MultiImageRequest request) {
        return APIResponse.success(imageService.getPresignedUrlForMultiple(request));
    }

    @PostMapping("/delete")
    public APIResponse<Map<String, String>> deleteImage(@RequestBody @NotNull String fileName) {
        Map<String, String> deletePreSingedUrl = imageService.getDeletePreSingedUrl(fileName);
        return APIResponse.success(deletePreSingedUrl);
    }
}
