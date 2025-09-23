package dsko.hier.security.infra;

import dsko.hier.security.domain.Jwt;
import dsko.hier.security.domain.JwtRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class JwtRepositoryImpl implements JwtRepository {
    private final JwtRedisRepository jwtRedisRepository;

    @Override
    public Jwt save(Jwt jwt) {
        return jwtRedisRepository.save(jwt);
    }

    @Override
    public void deleteById(String id) {
        jwtRedisRepository.deleteById(id);
    }

    @Override
    public Jwt findById(String id) {
        return jwtRedisRepository.findById(id).orElse(null);
    }
}
