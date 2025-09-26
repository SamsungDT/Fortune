package dsko.hier.fortune.application.strategy;

import dsko.hier.security.domain.User;

public interface FortuneStrategy<T> {
    T execute(User user, Object requestDto);

    String getRedisType();
}
