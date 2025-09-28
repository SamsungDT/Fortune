package dsko.hier.security.infra;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import dsko.hier.security.domain.BirthInfo;
import dsko.hier.security.domain.BirthTime;
import dsko.hier.security.domain.EmailPasswordAccount;
import dsko.hier.security.domain.EmailPasswordAccountRepository;
import dsko.hier.security.domain.Sex;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRole;
import jakarta.persistence.EntityManagerFactory;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.context.annotation.Import;

@Slf4j
@DataJpaTest
@Import(EmailPasswordAccountRepositoryImpl.class)
class EmailPasswordAccountRepositoryImplJpaTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private EmailPasswordAccountRepository emailPasswordAccountRepository;

    @Autowired
    private EntityManagerFactory entityManagerFactory;

    private Statistics statistics;

    @BeforeEach
    void setup() {
        // Hibernate Statistics 객체를 가져와 초기화
        SessionFactory sessionFactory = entityManagerFactory.unwrap(SessionFactory.class);
        statistics = sessionFactory.getStatistics();
        statistics.clear(); // 이전 테스트의 통계 정보 초기화
        statistics.setStatisticsEnabled(true);
    }

    @Test
    @DisplayName("이메일로 이메일 비밀번호 계정 조회 시 쿼리 한 번만 실행되는지 확인")
    void findByUserEmail_singleQueryCheck() {
        // Given

        log.info("시작 전 쿼리 횟수: {}", statistics.getPrepareStatementCount());

        BirthInfo birthInfo = BirthInfo.builder()
                .birthYear(2001)
                .birthMonth(8)
                .birthDay(6)
                .birthTime(BirthTime.Ja)
                .build();

        User user = User.builder()
                .email("test@example.com")
                .nickname("testuser")
                .role(UserRole.USER)
                .birthInfo(birthInfo)
                .sex(Sex.FEMALE)
                .build();
        entityManager.persist(user);

        log.info("User 엔티티 저장 후 쿼리 횟수: {}", statistics.getPrepareStatementCount());

        EmailPasswordAccount account = EmailPasswordAccount.builder()
                .passwordHash("hashedPassword123")
                .user(user)
                .build();
        entityManager.persist(account);
        log.info("EmailPasswordAccount 엔티티 저장 후 쿼리 횟수: {}", statistics.getPrepareStatementCount());
        entityManager.flush();
        log.info("엔티티 매니저 플러시 후 쿼리 횟수: {}", statistics.getPrepareStatementCount());
        entityManager.clear();
        log.info("엔티티 매니저 클리어 후 쿼리 횟수: {}", statistics.getPrepareStatementCount());

        log.info("EmailPasswordAccount 엔티티 저장 후 쿼리 횟수: {}", statistics.getPrepareStatementCount());

        // When
        Optional<EmailPasswordAccount> foundAccount = emailPasswordAccountRepository.findByUserEmail(
                "test@example.com");

        log.info("이메일로 계정 조회 후 쿼리 횟수: {}", statistics.getPrepareStatementCount());

        //의도적으로 User 엔티티를 다시 조회하여 N+1 문제가 발생하는지 확인
        foundAccount.ifPresent(
                acc -> {
                    User associatedUser = acc.getUser();
                    assertThat(associatedUser).isNotNull();
                    assertThat(associatedUser.getEmail()).isEqualTo("test@example.com");
                }
        );

        log.info("연관된 User 엔티티 접근 후 쿼리 횟수: {}", statistics.getPrepareStatementCount());

        // Then
        // 실행된 쿼리 수가 1인지 검증
        assertEquals(3, statistics.getPrepareStatementCount(), "쿼리 횟수가 1이 아닙니다.");
        assertThat(foundAccount).isPresent();
    }
}