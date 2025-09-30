package dsko.hier.fortune.presentation;

import dsko.hier.fortune.application.FortuneAnalyzeService;
import dsko.hier.fortune.dto.DailyFortuneResponse;
import dsko.hier.fortune.dto.DreamRequestDto;
import dsko.hier.fortune.dto.DreamResponse;
import dsko.hier.fortune.dto.FaceAnalyzeRequest;
import dsko.hier.fortune.dto.FaceAnalyzeResponse;
import dsko.hier.fortune.dto.TotalFortuneResponse;
import dsko.hier.global.response.APIResponse;
import dsko.hier.security.application.CustomUserDetails;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/fortune")
@RequiredArgsConstructor
public class FortuneController {
    private final FortuneAnalyzeService service;

    @PostMapping("/face")
    public APIResponse<FaceAnalyzeResponse> analyzeFace(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Validated @RequestBody FaceAnalyzeRequest request
    ) {
        FaceAnalyzeResponse response = service.getFaceAnalyzeResultOfUser(userDetails.getUsername(), request);
        return APIResponse.success(response);
    }

    @PostMapping
    public APIResponse<DreamResponse> interpretDream(
            @Validated @RequestBody DreamRequestDto req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        DreamResponse dreamResponseFromAI = service.getDreamInterpretationOfUser(userDetails.getUsername(), req);
        return APIResponse.success(dreamResponseFromAI);
    }

    @GetMapping("/daily")
    public APIResponse<DailyFortuneResponse> getTodaysFortune(@AuthenticationPrincipal CustomUserDetails userDetails) {
        DailyFortuneResponse response = service.getDailyFortuneOfUser(userDetails.getUsername());
        return APIResponse.success(response);
    }

    @GetMapping("/lifelong")
    public APIResponse<TotalFortuneResponse> getLifelongFortune(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        TotalFortuneResponse lieLongFortuneFromAI = service.getTotalFortuneOfUser(userDetails.getUsername());
        return APIResponse.success(lieLongFortuneFromAI);
    }

    @GetMapping("/face/{resultId}")
    public APIResponse<FaceAnalyzeResponse> getFaceResultById(
            @Validated @PathVariable UUID resultId
    ) {
        FaceAnalyzeResponse response = service.getFaceResultById(resultId);
        return APIResponse.success(response);
    }

    @GetMapping("/dream/{resultId}")
    public APIResponse<DreamResponse> getDreamResultById(
            @Validated @PathVariable UUID resultId
    ) {
        DreamResponse response = service.getDreamResultById(resultId);
        return APIResponse.success(response);
    }

    @GetMapping("/daily/{resultId}")
    public APIResponse<DailyFortuneResponse> getDailyResultById(
            @Validated @PathVariable UUID resultId
    ) {
        DailyFortuneResponse response = service.getDailyResultById(resultId);
        return APIResponse.success(response);
    }

    @GetMapping("/face/{resultId}")
    public APIResponse<TotalFortuneResponse> getTotalResultById(
            @Validated @PathVariable UUID resultId
    ) {
        TotalFortuneResponse response = service.getTotalResultById(resultId);
        return APIResponse.success(response);
    }
}
