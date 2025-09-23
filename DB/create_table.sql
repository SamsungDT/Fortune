-- 1) users
CREATE TABLE users (
  user_id      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, -- PK
  name         VARCHAR(50)      NOT NULL COMMENT '이름',
  email        VARCHAR(255)     NOT NULL COMMENT '이메일(로그인)',
  password     VARCHAR(255)     NOT NULL COMMENT '비밀번호 해시',
  birth_year   SMALLINT         NOT NULL COMMENT '생년',
  birth_month  TINYINT UNSIGNED NOT NULL COMMENT '생월(1~12)',
  birth_day    TINYINT UNSIGNED NOT NULL COMMENT '생일(1~31)',
  birth_hour   TINYINT          NULL COMMENT '탄생시(0~23, 미상 NULL)',
  created_at   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_users_email UNIQUE (email),
  CONSTRAINT chk_birth_month CHECK (birth_month BETWEEN 1 AND 12),
  CONSTRAINT chk_birth_day   CHECK (birth_day BETWEEN 1 AND 31),
  CONSTRAINT chk_birth_hour  CHECK (birth_hour IS NULL OR birth_hour BETWEEN 0 AND 23)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사용자';

-- 2) face_readings (관상)
CREATE TABLE face_readings (
  reading_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  title        VARCHAR(100)    NULL COMMENT '제목/요약',
  features     JSON            NULL COMMENT '관상 특징',
  result       TEXT            NOT NULL COMMENT '관상 해석 결과',
  score        TINYINT         NULL COMMENT '총평 점수(0~10)',
  image_url    VARCHAR(512)    NULL COMMENT '이미지 경로',
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_face_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT chk_face_score CHECK (score IS NULL OR score BETWEEN 0 AND 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='관상';

-- 3) daily_fortunes (오늘의 운세)
CREATE TABLE daily_fortunes (
  fortune_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  fortune_date DATE            NOT NULL COMMENT '해당 날짜',
  summary      VARCHAR(255)    NOT NULL,
  love         TEXT            NULL,
  money        TEXT            NULL,
  health       TEXT            NULL,
  work_study   TEXT            NULL,
  lucky_color  VARCHAR(50)     NULL,
  lucky_number VARCHAR(20)     NULL,
  lucky_item   VARCHAR(100)    NULL,
  rating       TINYINT         NULL COMMENT '0~10',
  source       VARCHAR(100)    NULL COMMENT '출처/버전',
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_daily_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT uq_daily_user_date UNIQUE (user_id, fortune_date),
  CONSTRAINT chk_daily_rating CHECK (rating IS NULL OR rating BETWEEN 0 AND 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='오늘의 운세';

-- 4) lifetime_fortunes (평생 운세)
CREATE TABLE lifetime_fortunes (
  fortune_id   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  summary      TEXT            NOT NULL,
  career       TEXT            NULL,
  wealth       TEXT            NULL,
  love         TEXT            NULL,
  health       TEXT            NULL,
  advice       TEXT            NULL,
  model_ver    VARCHAR(50)     NULL COMMENT '모델/룰 버전',
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_life_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='평생 운세';

-- 5) dream_interpretations (해몽)
CREATE TABLE dream_interpretations (
  dream_id     BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  dream_date   DATE            NULL COMMENT '꿈 꾼 날짜',
  keywords     VARCHAR(200)    NULL,
  dream_text   TEXT            NOT NULL COMMENT '꿈 내용',
  interpretation TEXT          NOT NULL COMMENT '해석',
  category     VARCHAR(50)     NULL COMMENT '분류',
  luck_score   TINYINT         NULL COMMENT '0~10',
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_dream_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT chk_dream_luck CHECK (luck_score IS NULL OR luck_score BETWEEN 0 AND 10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='해몽';
