package dsko.hier.security.domain;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Data
@RedisHash
public class Jwt {

    @Id
    @ToString.Include
    private String id;

    @NotNull
    @ToString.Include
    private String accessToken;

    @NotNull
    @ToString.Include
    private String refreshToken;

    @Builder
    public Jwt(String id, String accessToken, String refreshToken) {
        this.id = id;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

}
