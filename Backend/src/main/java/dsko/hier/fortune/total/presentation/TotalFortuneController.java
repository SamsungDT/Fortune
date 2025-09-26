package dsko.hier.fortune.total.presentation;

import dsko.hier.fortune.total.application.TotalFortuneService;
import dsko.hier.fortune.total.dto.resposne.TotalFortuneResponse;
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
public class TotalFortuneController {

    private final TotalFortuneService service;

    @GetMapping
    public APIResponse<TotalFortuneResponse> getLifelongFortune(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        TotalFortuneResponse lieLongFortuneFromAI = service.getLieLongFortuneFromAI(userDetails.getUsername());
        return APIResponse.success(lieLongFortuneFromAI);
    }


}
