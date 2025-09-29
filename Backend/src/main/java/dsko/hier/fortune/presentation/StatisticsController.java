package dsko.hier.fortune.presentation;

import dsko.hier.fortune.dto.AllOfMyResultResponse;
import dsko.hier.fortune.dto.Statistics;
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
@RequestMapping("/api/fortune/statistics")
@RequiredArgsConstructor
public class StatisticsController {


    private final StatisticsService service;

    // StatisticsController.java 수정
    @GetMapping
    public APIResponse<Statistics> getStatistics() {
        return APIResponse.success(service.getStatistics());
    }

    @GetMapping("/findAll")
    public APIResponse<AllOfMyResultResponse> findAllOfMyResult(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return APIResponse.success(
                service.findAllOfMyResult(userDetails.getUsername())
        );
    }

}
