package dsko.hier.fortune.face.presentation;

import dsko.hier.fortune.face.application.FaceService;
import dsko.hier.fortune.face.dto.FaceAnalyzeRequest;
import dsko.hier.fortune.face.dto.FaceAnalyzeResponse;
import dsko.hier.global.response.APIResponse;
import dsko.hier.security.application.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/fortune/face")
@RequiredArgsConstructor
public class FaceController {

    private final FaceService faceService;

    @PostMapping
    public APIResponse<FaceAnalyzeResponse> analyzeFace(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Validated @RequestBody FaceAnalyzeRequest request
    ) {
        FaceAnalyzeResponse response = faceService.analyzeFaceWithAI(userDetails.getUsername(), request);
        return APIResponse.success(response);
    }
}
