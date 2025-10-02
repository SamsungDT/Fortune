# AI 종합 운세 서비스

## 0. 사용해보기

* [AI 종합 운세 서비스](https://fortuneki.site)

---

## 1. 프로그램 소개

* AI 기반 재미용 서비스

  * 관상
  * 오늘의 운세
  * 평생 운세
  * 해몽

---

## 2. 주요 기능

* **운세 분석**: 관상, 오늘의 운세, 평생 운세, 해몽 제공
* **회원 시스템**: Spring Security + JWT 기반 인증

  * 로그인 시 MySQL 조회 → JWT 발급
* **파일 업로드**: AWS S3 Presigned URL 사용 → 서버 부하 감소
* **시스템 모니터링**: Prometheus + Grafana
* **실시간 알림**: 서버 오류 발생 시 Discord 알림

## 3. 팀 구성원

| 고동수 | 김나연 | 김지예 | 박선민 | 박재규 |
|:----:|:----:|:----:|:----:|:----:|
|[<img src="https://github.com/kdongsu5509.png" width="100px">](https://github.com/kdongsu5509) | [<img src="https://github.com/kimnaiyeon.png" width="100px">](https://github.com/kimnaiyeon) |[<img src="https://github.com/6715sunmin.png" width="100px">](https://github.com/6715sunmin)  | [<img src="https://github.com/Mariajiye.png" width="100px">](https://github.com/Mariajiye) | [<img src="https://github.com/bb0479.png" width="100px">](https://github.com/bb0479) |
| 백엔드 | 프론트엔드 | 프론트엔드 | 프론트엔드, PM | | 프론트엔드 |


## 4. 기술 스택 및 개발 환경

### 디자인

<img src="https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white">

### 백엔드

<div>
  <img src= "https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white">
  <img src= "https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=whiteh">
  <img src="https://img.shields.io/badge/Spring Data JPA-6DB33F?style=for-the-badge&logo=SpringDataJPA&logoColor=white">
  <img src="https://img.shields.io/badge/Spring Data Redis-6DB33F?style=for-the-badge&logo=SpringDataRedis&logoColor=white">
  <img src="https://img.shields.io/badge/QueryDSL-6DB33F?style=for-the-badge&logo=QueryDSL&logoColor=white">
  <img src="https://img.shields.io/badge/Spring AI-6DB33F?style=for-the-badge&logo=SpringAI&logoColor=white">
  <img src="https://img.shields.io/badge/Spring Security-6DB33F?style=for-the-badge&logo=SpringSecurity&logoColor=white">
</div>
<div>
  <img src= "https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white">
  <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/IntelliJ_IDEA-000000.svg?style=for-the-badge&logo=intellij-idea&logoColor=white">
</div>

### 프론트엔드
<div>
  <img src= "https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  <img src= "https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src= "https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white">
</div>

### 모니터링

<div>
  <img src="https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white">
  <img src="https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white">
  <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white">
</div>

### 인프라

<div>
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=Nginx&logoColor=white">
  <img src="https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white">
  <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white">
</div>

### 협업 도구
<div>
  <img src="https://img.shields.io/badge/Git-F05032.svg?&style=for-the-badge&logo=Git&logoColor=white">
  <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
  <img src="https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white">
</div>
<br>

### 배포 및 운영 환경

- **AI 통합**: Spring AI Framework, Structured Output  
- **보안/인증**: Spring Security, JWT 기반 인증  
- **DB**: Redis, MYSQL, Spring Data JPA, QueryDSL, Amazon ECR
- **배포 환경**: Docker · GitHub Actions · AWS EC2 · Amazon ECR

## 📂 프로젝트 구조

```
Fortune/
├── .github/
│     └── ISSUE_TEMPLATE/           # 이슈 템플릿
│     └── workflows/                # CI/CD
│     └── PULL_REQUEST_TEMPLATE.md  # PR 템플릿
├── AdminPage/                      # 관리자 페이지
├── Backend/                        # 백엔드 코드
├── Frontend/                       # 프론트엔드 코드
├── .gitignore
└── README.md
```

---

## 백엔드 핵심

* **전략 패턴 적용**: 코드 중복 제거

  * `FortuneStrategy` 인터페이스: `execute()`, `getRedisType()`
  * `AbstractFortuneStrategy`: 공통 로직 구현
  * 구체 전략 클래스: `DailyFortuneStrategy`, `FaceStrategy` 등
  * `FortuneContext`: 요청에 맞는 전략 실행
* **성능 최적화**

  * Redis 사용
  * Refresh token 저장
  * 서비스 통계 관리

---

## 5. ERD
<img width="1304" height="800" alt="image" src="https://github.com/user-attachments/assets/d88dfb65-9e15-4d7c-860c-08808a0e6c4e" />

## 6. 전체 시스템 구성
<img width="1219" height="528" alt="image" src="https://github.com/user-attachments/assets/23a81707-1d52-4802-89ef-59549ef84566" />

---

## 7. CI/CD

* **CI**

  * GitHub Actions
  * main 브랜치 푸시 시 자동 빌드 & 테스트
  * Docker 이미지 빌드 → ECR 푸시
* **CD**

  * EC2 SSH 접속 → 최신 이미지 pull
  * `docker-compose up -d` 자동 실행
  * Prometheus 설정 자동 반영
  * 이전 이미지 자동 정리

```yaml
# .github/workflows/ci-cd.yml

name: Spring CI-CD with AWS

on:
    workflow_dispatch:
    push:
        branches: ["main"]
        paths:
            - "Backend/**"
env:
    AWS_REGION: ap-northeast-2
    ECR_REPOSITORY: fortune-ar
    CONTAINER_NAME: spring-server-container
    PROJECT_PATH: ./Backend

jobs:
    # -------------------- CI (Build & Push to ECR) --------------------
    ci:
        name: Continuous Integration
        runs-on: ubuntu-latest

        outputs:
            image_uri: ${{ steps.build-image.outputs.image }}

        services:
            redis:
                image: redis:7-alpine
                ports:
                    - 6379:6379
                options: >-
                    --network-alias redis

        steps:
            - name: Checkout
              uses: actions/checkout@v4

            - name: Set up JDK 21
              uses: actions/setup-java@v4
              with:
                  java-version: "21"
                  distribution: "temurin"

            - name: Grant execute permission for gradlew
              run: chmod +x ${{ env.PROJECT_PATH }}/gradlew

            - name: Add application-secret.yaml
              env:
                  SPRING_SECRET_YAML: ${{ secrets.SPRING_SECRET_YAML }}
              run: |
                  echo "$SPRING_SECRET_YAML" > ${{ env.PROJECT_PATH }}/src/main/resources/application-secret.yaml

            - name: Build with Gradle (do tests internally)
              run: ./gradlew clean build
              working-directory: ${{ env.PROJECT_PATH }}

            - name: Configure AWS credentials
              uses: aws-actions/configure-aws-credentials@v4
              with:
                  aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
                  aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
                  aws-region: ${{ env.AWS_REGION }}

            - name: Login to Amazon ECR
              id: login-ecr
              uses: aws-actions/amazon-ecr-login@v2

            - name: Build, tag, and push image to Amazon ECR
              id: build-image
              env:
                  ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
                  IMAGE_TAG: ${{ github.sha }}
              run: |
                  set -euo pipefail
                  docker build -t "$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" -f ${{ env.PROJECT_PATH }}/Dockerfile ${{ env.PROJECT_PATH }}
                  docker push "$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
                  echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> "$GITHUB_OUTPUT"

    # -------------------- CD (Deploy on EC2) --------------------
    cd:
        name: Continuous Deployment
        needs: ci
        runs-on: ubuntu-latest

        steps:
            - name: Get GitHub Action VM IP
              id: ip
              uses: haythem/public-ip@v1.3
            - name: Configure AWS credentials
              uses: aws-actions/configure-aws-credentials@v4
              with:
                  aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
                  aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
                  aws-region: ${{ env.AWS_REGION }}
            - name: Add GitHub Action VM IP to EC2 security group (SSH)
              run: |
                  aws ec2 authorize-security-group-ingress \
                      --group-id ${{ secrets.EC2_SECURITY_GROUP_ID }} \
                      --protocol tcp \
                      --port 22 \
                      --cidr ${{ steps.ip.outputs.ipv4 }}/32
            - name: Deploy to EC2 via SSH
              uses: appleboy/ssh-action@v1.0.3
              with:
                  host: ${{ secrets.EC2_HOST }}
                  username: ${{ secrets.EC2_USERNAME }}
                  key: ${{ secrets.EC2_SSH_KEY }}
                  script: |
                      set -euo pipefail
                      IMAGE_URI='${{ needs.ci.outputs.image_uri }}'
                      if [ -z "$IMAGE_URI" ]; then
                          echo "ERROR: IMAGE_URI is empty. Check CI job outputs." >&2
                          exit 1
                      fi
                      ECR_REGISTRY_URL="$(echo "$IMAGE_URI" | cut -d/ -f1)"

                      echo "Downloading docker-compose.yml..."
                      # GitHub 레포지토리에서 도커 컴포즈 파일 다운로드 (경로 수정)
                      wget -O docker-compose.yml https://raw.githubusercontent.com/SamsungDT/Fortune/main/Backend/docker-compose.yml

                      # Prometheus 설정 파일 다운로드 (추가)
                      echo "Downloading prometheus.yml..."
                      wget -O prometheus.yml https://raw.githubusercontent.com/SamsungDT/Fortune/main/Backend/prometheus.yml

                      echo "Logging in to ECR..."
                      aws ecr get-login-password --region '${{ env.AWS_REGION }}' \
                          | docker login --username AWS --password-stdin "$ECR_REGISTRY_URL"

                      echo "Pulling the latest image..."
                      docker pull "$IMAGE_URI"

                      # 도커 컴포즈 파일의 fortune-ar 이미지 태그를 최신 이미지로 변경
                      echo "Updating docker-compose.yml with new image tag..."
                      sed -i "s|fortune-ar:latest|$IMAGE_URI|g" docker-compose.yml

                      echo "Running docker-compose up..."
                      docker compose -f docker-compose.yml up -d

                      # 이전 이미지 삭제 (선택 사항)
                      echo "Cleaning up old images..."
                      docker image prune -f
            - name: Remove GitHub Action VM IP from EC2 security group
              if: always()
              run: |
                  aws ec2 revoke-security-group-ingress \
                      --group-id ${{ secrets.EC2_SECURITY_GROUP_ID }} \
                      --protocol tcp \
                      --port 22 \
                      --cidr ${{ steps.ip.outputs.ipv4 }}/32
```
