package dt.fortune_user.presentation;

import dt.fortune_user.application.JwtService;
import dt.fortune_user.domain.JwtResult;
import dt.fortune_user.global.response.APIResponse;
import dt.fortune_user.presentation.dto.NodeTokenValidationReqeust;
import dt.fortune_user.presentation.dto.TokenReissueRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(
        name = "인증",
        description = "인증 관련 API"
)
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtService jwtService;

    @Operation(
            summary = "Access/Refresh 재발급",
            description = "Request Body에 담긴 유효한 Refresh Token을 사용하여 새로운 Access Token과 Refresh Token을 발급받습니다."
    )
    @PostMapping(value = "/reissue", consumes = "application/json")
    public JwtResult.Issue reissue(
            @Validated @RequestBody TokenReissueRequestDto req) {
        return jwtService.reissueJwtToken(req.refreshToken());
    }

    //1. 회원가입. 로그인 -> 스프링 서버로 보낸다.
    //2. 그 외 인증 기능은 스프링에게 물어보는 방식으로 진행한다.
    @PostMapping("/nodeCheck")
    public APIResponse<Boolean> validateJwtToken(@RequestBody NodeTokenValidationReqeust req) {
        return APIResponse.success(jwtService.validateAccessToken(req.accessTokenFromNode()));
    }

}
