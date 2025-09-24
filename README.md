# 주의

- 현재 `main` 브랜치에 `push` 작업은 막혀있습니다.
- 개인 브랜치 작성 후 `pull request` 생성 후 병합 진행해주세요

# Backend

- 로그인 및 회원가입 완료

- 실행 방법

- ```powershell
  cd Backend
  docker build -t spring-server .

  docker compose up -d
  ```

### 주의
- `FortuneKI\Backend\src\main\resources\application-secret.yml` 을 생성하여야 합니다.
- 해당 내용은 Notion 페이지를 참고하세요
