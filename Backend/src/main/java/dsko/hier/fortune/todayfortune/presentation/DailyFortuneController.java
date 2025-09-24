package dsko.hier.fortune.todayfortune.presentation;

import dsko.hier.fortune.todayfortune.application.DailyFortuneService;
import dsko.hier.fortune.todayfortune.dto.response.DailyFortuneResponse;
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
@RequestMapping("/api/fortune/daily")
@RequiredArgsConstructor
public class DailyFortuneController {

    private final DailyFortuneService dailyFortuneService;

    @GetMapping
    public APIResponse<DailyFortuneResponse> getTodaysFortune(@AuthenticationPrincipal CustomUserDetails userDetails) {
        DailyFortuneResponse response = dailyFortuneService.getTodaysFortuneFromAI(userDetails.getUsername());
        return APIResponse.success(response);
    }

}
