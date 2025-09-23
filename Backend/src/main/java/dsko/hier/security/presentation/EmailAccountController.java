package dsko.hier.security.presentation;

import dsko.hier.global.response.APIResponse;
import dsko.hier.security.application.LoginService;
import dsko.hier.security.application.SignUpService;
import dsko.hier.security.dto.request.EmailAndPassword;
import dsko.hier.security.dto.request.EmailCheckDto;
import dsko.hier.security.dto.request.EmailSignUpDto;
import dsko.hier.security.dto.response.TokenResponse;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/security/email")
@RequiredArgsConstructor
public class EmailAccountController {

    private final SignUpService signUpService;
    private final LoginService loginService;

    @PostMapping("/signup")
    public APIResponse<UUID> signUpViaEmailAndPassword(@Validated @RequestBody EmailSignUpDto req) {
        UUID newUserId = signUpService.signUp(req);
        return APIResponse.success(newUserId);
    }

    @PostMapping("/check-email")
    public APIResponse<Boolean> checkEmailDuplicate(@Validated @RequestBody EmailCheckDto req) {
        return APIResponse.success(signUpService.isDuplicateEmail(req.email()));
    }

    @PostMapping("/login")
    public APIResponse<TokenResponse> loginWithEmailAndPassword(@Validated @RequestBody EmailAndPassword req) {
        TokenResponse tokenResponse = loginService.emailAndPasswordLogin(req);
        return APIResponse.success(tokenResponse);
    }
}
