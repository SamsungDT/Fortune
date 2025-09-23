package dsko.hier.security.domain;

public interface JwtRepository {
    Jwt save(Jwt jwt);

    void deleteById(String id);

    Jwt findById(String id);
}
