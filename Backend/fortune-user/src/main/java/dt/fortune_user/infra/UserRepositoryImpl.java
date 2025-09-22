package dt.fortune_user.infra;

import static dt.fortune_user.global.exception.CustomExcpMsgs.USER_NOT_FOUND;

import dt.fortune_user.domain.User;
import dt.fortune_user.domain.UserRepository;
import dt.fortune_user.global.exception.CustomExceptions.UserException;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {

    private final UserJpaRepository UserJpaRepository;


    @Override
    public UUID save(User user) {
        return UserJpaRepository.save(user).getId();
    }

    @Override
    public Optional<User> findById(UUID id) {
        return UserJpaRepository.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return UserJpaRepository.findByEmail(email);
    }

    @Override
    public void deleteById(UUID id) {
        if (!UserJpaRepository.existsById(id)) {
            throw new UserException(USER_NOT_FOUND.getMessage() + id);
        }
        UserJpaRepository.deleteById(id);
    }

    @Override
    public void update(User user) {
        if (!UserJpaRepository.existsById(user.getId())) {
            throw new UserException(USER_NOT_FOUND.getMessage() + user.getId());
        }
        UserJpaRepository.save(user);
    }

    @Override
    public Collection<User> findAll() {
        return UserJpaRepository.findAll();
    }

    @Override
    public boolean existsByEmail(String email) {
        return UserJpaRepository.existsByEmail(email);
    }

    @Override
    public void delete(User user) {
        UserJpaRepository.delete(user);
    }
}
