package dsko.hier.security.infra;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dsko.hier.security.domain.Jwt;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class JwtRepositoryImplTest {

    @Mock
    private JwtRedisRepository jwtRedisRepository;

    @InjectMocks
    private JwtRepositoryImpl jwtRepositoryImpl;

    @Test
    @DisplayName("JWT 객체 저장 시 save 메서드가 호출된다")
    void testSave() {
        // Given
        Jwt jwt = new Jwt("test-id", "test-token", "test-refresh-token");
        when(jwtRedisRepository.save(jwt)).thenReturn(jwt);

        // When
        Jwt savedJwt = jwtRepositoryImpl.save(jwt);

        // Then
        assertThat(savedJwt).isNotNull();
        assertThat(savedJwt.getId()).isEqualTo("test-id");
        verify(jwtRedisRepository, times(1)).save(jwt);
    }

    @Test
    @DisplayName("ID로 JWT 객체를 삭제할 때 deleteById 메서드가 호출되어야 한다.")
    void testDeleteById() {
        // Given
        String id = "test-id";

        // When
        jwtRepositoryImpl.deleteById(id);

        // Then
        verify(jwtRedisRepository, times(1)).deleteById(id);
    }

    @Test
    @DisplayName("ID로 JWT 객체를 찾을 때 findById 메서드가 호출되어야 한다.")
    void testFindByIdFound() {
        // Given
        String id = "test-id";
        Jwt jwt = new Jwt("test-id", "test-token", "test-refresh-token");
        when(jwtRedisRepository.findById(id)).thenReturn(Optional.of(jwt));

        // When
        Jwt foundJwt = jwtRepositoryImpl.findById(id);

        // Then
        assertThat(foundJwt).isNotNull();
        assertThat(foundJwt.getId()).isEqualTo(id);
        verify(jwtRedisRepository, times(1)).findById(id);
    }

    @Test
    @DisplayName("ID로 JWT 객체를 찾을 수 없을 때 null을 반환해야 한다.")
    void testFindByIdNotFound() {
        // Given
        String id = "non-existent-id";
        when(jwtRedisRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Jwt foundJwt = jwtRepositoryImpl.findById(id);

        // Then
        assertThat(foundJwt).isNull();
        verify(jwtRedisRepository, times(1)).findById(id);
    }


}