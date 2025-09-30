package dsko.hier.security.presentation;

import dsko.hier.global.response.APIResponse;
import dsko.hier.security.application.CustomUserDetails;
import dsko.hier.security.application.InfoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/info/me")
@RequiredArgsConstructor
public class UserInfoController {

    private final InfoService infoService;

    @GetMapping
    public APIResponse<String> getUserInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String name = infoService.getName(userDetails.getUsername());
        return APIResponse.success(name);
    }
}
