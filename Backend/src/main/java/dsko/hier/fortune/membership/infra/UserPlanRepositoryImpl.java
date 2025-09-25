package dsko.hier.fortune.membership.infra;

import dsko.hier.fortune.membership.domain.UserPlan;
import dsko.hier.fortune.membership.domain.UserPlanRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

@Slf4j
@Repository
@RequiredArgsConstructor
public class UserPlanRepositoryImpl implements UserPlanRepository {

    private final UserPlanJpaRepository repository;


    @Override
    public UserPlan save(UserPlan entity) {
        return repository.save(entity);
    }

    @Override
    public Optional<UserPlan> findByUserEmail(String email) {
        return repository.findByUserEmail(email);
    }
}
