package dsko.hier.security.infra;

import dsko.hier.security.domain.Jwt;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JwtRedisRepository extends CrudRepository<Jwt, String> {
}
