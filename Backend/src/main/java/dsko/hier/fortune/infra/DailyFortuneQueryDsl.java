package dsko.hier.fortune.infra;

import static dsko.hier.fortune.domain.dailyDomain.QDailyFortune.dailyFortune;

import com.querydsl.jpa.impl.JPAQueryFactory;
import dsko.hier.fortune.domain.dailyDomain.DailyFortune;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.stereotype.Component;

@Component
public class DailyFortuneQueryDsl {

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public DailyFortuneQueryDsl(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    public Optional<DailyFortune> findByUserEmailAndCreatedAt(String userEmail, LocalDateTime today) {
        return Optional.ofNullable(queryFactory
                .selectFrom(dailyFortune)
                .join(dailyFortune.user)
                .where(dailyFortune.user.email.eq(userEmail)
                        .and(dailyFortune.createdAt.dayOfYear().eq(today.getDayOfYear())
                                .and(dailyFortune.createdAt.year().eq(today.getYear())))
                )
                .fetchOne());
    }


}
