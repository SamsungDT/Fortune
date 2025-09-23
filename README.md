# 주의
- 현재 `main` 브랜치에 `push` 작업은 막혀있습니다.
- 개인 브랜치 작성 후 `pull request` 생성 후 병합 진행해주세요

# Backend
- 로그인 및 회원가입 완료

- 실행 방법
- ```powershell
  cd Backend/fortune-user # 스프링 서버 폴더로 이동
  docker build -t spring . #docker를 통한 이미지 생성
  docker run -d -p 8080:8080 --name spring-server spring #생성된 이미지 기반으로 도커 컨테이너 실행
  ```
