package dt.fortune_user.presentation;

import dt.fortune_user.application.UserService;
import dt.fortune_user.global.response.APIResponse;
import dt.fortune_user.presentation.dto.UserRespDto;
import dt.fortune_user.presentation.dto.UserUpdateDto;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/all") // 모든 사용자 정보 조회 엔드포인트
    public APIResponse<List<UserRespDto>> getUserInfo() {
        List<UserRespDto> allUsers = userService.getAllUsers();
        return APIResponse.success(allUsers);
    }

    @GetMapping("/{id}") // 사용자 상세 정보 조회 엔드포인트
    public APIResponse<UserRespDto> getUserDetail(@PathVariable UUID id) {
        return APIResponse.success(userService.getUserDetail(id));
    }

    //수정
    @PutMapping("/{id}")
    public APIResponse<Void> updateUser(@PathVariable UUID id, @RequestBody UserUpdateDto dto) {
        userService.updateUser(id, dto);
        return APIResponse.success();
    }

    //삭제
    @DeleteMapping("/{id}")
    public APIResponse<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return APIResponse.success();
    }
}
