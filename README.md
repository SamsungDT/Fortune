# Backend
- 로그인 및 회원가입 완료

- 실행 방법
- ```powershell
  cd Backend/fortune-user # 스프링 서버 폴더로 이동
  docker build -t spring . #docker를 통한 이미지 생성
  docker run -d -p 8080:8080 --name spring-server spring #생성된 이미지 기반으로 도커 컨테이너 실행
  ```

