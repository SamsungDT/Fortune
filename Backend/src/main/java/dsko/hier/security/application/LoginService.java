package dsko.hier.security.application;

import dsko.hier.global.redis.RedisTokenService;
import dsko.hier.security.dto.request.EmailAndPassword;
import dsko.hier.security.dto.response.TokenResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class LoginService {

    private final JwtTokenProvider tokenProvider;
    private final JwtTokenService jwtTokenService;
    private final RedisTokenService redisTokenService;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder passwordEncoder;

    public TokenResponse emailAndPasswordLogin(EmailAndPassword req) {

        log.info("로그인 서비스 진입");
        log.info("로그인 서비스에 들어온 이메일 : {}", req.email());

        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.email(),
                        req.password()
                )
        );

        log.info("로그인 완료 : {}", authenticate.isAuthenticated());

        // 3. 인증 정보 기반으로 JWT 토큰 생성
        log.info("PRINCIPAL : {}", authenticate.getPrincipal());
        UserDetails principal = (UserDetails) authenticate.getPrincipal();

        return jwtTokenService.issueJwtAuth(principal.getUsername(),
                principal.getAuthorities().iterator().next().getAuthority());
    }

    public void logout(String token) {
        String username = tokenProvider.getUsernameFromToken(token.substring(7));
        redisTokenService.deleteRefreshToken(username);
        log.info("User {} logged out, refresh token deleted from Redis", username);
    }

    public TokenResponse tokenReIssue(String rawToken) {
        return jwtTokenService.reissueJwtToken(rawToken.substring(7));
    }
}
