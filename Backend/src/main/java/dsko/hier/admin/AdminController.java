package dsko.hier.admin;

import dsko.hier.admin.application.AdminService;
import dsko.hier.admin.dto.AdminEmailSignUpDto;
import dsko.hier.admin.dto.UserDetailInformation;
import dsko.hier.admin.dto.UserInformation;
import dsko.hier.global.response.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService service;

    //관리자 회원 가입
    @PostMapping("/signup")
    public APIResponse<Void> signup(@Validated @RequestBody AdminEmailSignUpDto req) {
        service.signUpAsAdmin(req);
        return APIResponse.success();
    }

    //관리자 전체 회원 조회
    @GetMapping("/users")
    public APIResponse<Page<UserInformation>> getUsers(@PageableDefault(page = 0, size = 10) Pageable pageable) {
        Page<UserInformation> users = service.getUsers(pageable);
        return APIResponse.success(users);
    }

    //관리자 세부 회원 조회
    @PostMapping("/user")
    public APIResponse<UserDetailInformation> getUser(@Validated @RequestBody UserCRUDRequest req) {
        UserDetailInformation user = service.getUser(req);
        return APIResponse.success(user);
    }

    // 관리자 회원 삭제
    @DeleteMapping("/user")
    public APIResponse<Void> logout(@Validated @RequestBody UserCRUDRequest req) {
        service.deleteUser(req);
        return APIResponse.success();
    }

    // 관리자 회원 토큰 만료
    @PostMapping("/refresh-expired")
    public APIResponse<Void> refresh(@Validated @RequestBody UserCRUDRequest req) {
        service.expiredUserTokens(req);
        return APIResponse.success();
    }

    // 관리자가 사용자를 블랙리스트에 추가
    @PostMapping("/blacklist")
    public APIResponse<Void> addToBlacklist(@Validated @RequestBody UserCRUDRequest req) {
        service.addUserToBlacklist(req);
        return APIResponse.success();
    }

    //관리자가 사용자에게 추가적인 무료 운세 기회 제공
    @PostMapping("/add-free-fortune/{count}")
    public APIResponse<Void> addFreeFortuneCount(@Validated @RequestBody UserCRUDRequest req, @PathVariable int count) {
        service.addFreeFortuneCount(req, count);
        return APIResponse.success();
    }
}
