package dt.fortune_user.application;

import dt.fortune_user.domain.User;
import dt.fortune_user.domain.UserRepository;
import dt.fortune_user.presentation.dto.EmailRespDto;
import dt.fortune_user.presentation.dto.UserDto;
import dt.fortune_user.presentation.dto.UserRespDto;
import dt.fortune_user.presentation.dto.UserUpdateDto;
import jakarta.persistence.EntityManager;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final EntityManager em;

    public UUID signUp(UserDto req) {
        //사용자 생성
        User user = toUser(req);
        return userRepository.save(user);
    }

    private User toUser(UserDto req) {
        return User.builder()
                .name(req.name())
                .email(req.email())
                .password(encodePassword(req.password()))
                .role("USER")
                .year(req.year())
                .month(req.month())
                .day(req.day())
                .birthTime(req.birthTime())
                .build();
    }

    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }

    public EmailRespDto isEmailUnique(String email) {
        boolean isExist = userRepository.existsByEmail(email.trim());
        return new EmailRespDto(!isExist);
    }

    public List<UserRespDto> getAllUsers() {
        Collection<User> all = userRepository.findAll();
        if (!all.isEmpty()) {
            return all.stream()
                    .map(user -> new UserRespDto(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            user.getBirthYear(),
                            user.getBirthMonth(),
                            user.getBirthDay(),
                            user.getBirthTime()
                    ))
                    .toList();
        }

        return List.of();
    }

    public UserRespDto getUserDetail(UUID id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다: " + id)
        );

        return new UserRespDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getBirthYear(),
                user.getBirthMonth(),
                user.getBirthDay(),
                user.getBirthTime()
        );
    }

    @Transactional
    public void updateUser(UUID id, UserUpdateDto dto) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다: " + id)
        );

        user.update(dto);
    }

    public void deleteUser(UUID id) {
        User user = userRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 사용자를 찾을 수 없습니다: " + id)
        );

        userRepository.delete(user);
        em.flush();
        em.clear();
    }
}
