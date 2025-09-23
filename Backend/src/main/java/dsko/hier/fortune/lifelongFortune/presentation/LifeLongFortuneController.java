package dsko.hier.fortune.lifelongFortune.presentation;

import dsko.hier.fortune.lifelongFortune.application.LifelongFortuneService;
import dsko.hier.fortune.lifelongFortune.dto.resposne.LifelongFortuneResponse;
import dsko.hier.global.response.APIResponse;
import dsko.hier.security.application.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/fortune/lifelong")
@RequiredArgsConstructor
public class LifeLongFortuneController {

    private final LifelongFortuneService service;

    @GetMapping
    public APIResponse<LifelongFortuneResponse> getLifelongFortune(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        LifelongFortuneResponse lieLongFortuneFromAI = service.getLieLongFortuneFromAI(userDetails.getUsername());
        return APIResponse.success(lieLongFortuneFromAI);
    }


}
