package dsko.hier.fortune.face.application;

import dsko.hier.fortune.face.domain.Face;
import dsko.hier.fortune.face.domain.FaceRepository;
import dsko.hier.fortune.face.domain.ImageType;
import dsko.hier.fortune.face.dto.FaceAnalyzeRequest;
import dsko.hier.fortune.face.dto.FaceAnalyzeResponse;
import dsko.hier.fortune.membership.application.UserPlanService;
import dsko.hier.global.exception.CustomExceptions.UserException;
import dsko.hier.global.exception.CustomExcpMsgs;
import dsko.hier.global.redis.RedisHashService;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRepository;
import java.net.URI;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.messages.UserMessage.Builder;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.content.Media;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class FaceService {

    private final ChatModel chatmodel;
    private final UserRepository userRepository;
    private final FaceRepository faceRepository;
    private final UserPlanService userPlanService;
    private final RedisHashService redisHashService;

    public FaceAnalyzeResponse analyzeFaceWithAI(String userEmail, FaceAnalyzeRequest request) {
        // 1. 사용자 정보 조회
        User user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + userEmail)
        );

        // 사용자 플랜 확인 및 무료 운세 카운트 감소
        if (!userPlanService.checkUserHaveRightIfHaveThenReduceCount(user.getEmail())) {
            throw new UserException(CustomExcpMsgs.FREE_FORTUNE_COUNT_EXCEEDED.getMessage());
        }

        // 2. 얼굴 분석 로직 구현 (예: AI 모델 호출 등)
        Map<String, Object> params = Map.of(
                "name", user.getName(),
                "birthYear", user.getBirthInfo().getBirthYear()
        );

        PromptTemplate promptTemplate = new PromptTemplate(faceReadingPromptBuilder());
        String contents = promptTemplate.create(params).getContents();
        MimeType imageType =
                (request.imageType() == ImageType.JPEG) ? MimeTypeUtils.IMAGE_JPEG : MimeTypeUtils.IMAGE_PNG;

        Builder media = UserMessage.builder()
                .text(contents)
                .media(
                        List.of(Media.builder()
                                .mimeType(imageType)
                                .data(URI.create(request.imageUrl()))
                                .build()
                        )
                );

        log.info("AI 프롬프트: {}", contents);
        AIFaceAnalyzeResult aiResponse = ChatClient.create(chatmodel)
                .prompt()
                .messages(media.build())
                .call()
                .entity(AIFaceAnalyzeResult.class);

        log.info("AI 응답: {}", aiResponse);
        log.info("저장 로직 시작");

        //레디스에 값 올리기.
        redisHashService.incrementFortuneCount(RedisHashService.FACE_TYPE);

        // 3. 분석 결과 저장
        Face savedResult = faceRepository.save(toEntity(user, aiResponse));
        log.info("저장 완료: {}", savedResult);
        // 4. 분석 결과 반환
        return toResponseDto(savedResult);
    }

    private FaceAnalyzeResponse toResponseDto(Face face) {

        return new FaceAnalyzeResponse(
                face.getOverallImpression(),
                face.getEye(),
                face.getNose(),
                face.getMouth(),
                face.getAdvice()
        );
    }

    private Face toEntity(User user, AIFaceAnalyzeResult aiResponse) {
        return new Face(user, aiResponse);
    }

    private String faceReadingPromptBuilder() {
        return """
                당신은 전문가 수준의 관상가입니다.
                사용자가 제공한 사진 속 얼굴의 특징을 바탕으로 관상을 분석해주세요.
                관상 분석 내용은 긍정적이고 희망적인 어조로 작성하되, 실질적인 조언을 포함하여 사용자가 삶에 긍정적인 영향을 줄 수 있도록 해주세요.
                
                **[요청 형식]**
                이름 : {name}
                생년 : {birthYear}
                
                **[분석 항목]**
                **1. 총론 (OverallImpression)**
                - 🌟 오늘의 총론: 관상 총평 및 주요 특징 요약.
                
                **2. 부위별 관상 (Eye, Nose, Mouth 등)**
                - 👀 눈: 눈의 모양, 크기, 눈빛을 중심으로 연애운 및 통찰력에 대한 설명을 작성.
                - 👃 코: 코의 모양, 크기를 중심으로 재물운 및 자존심에 대한 설명을 작성.
                - 👄 입: 입의 모양, 크기, 입꼬리를 중심으로 언변, 식복, 말년에 대한 설명을 작성.
                - 👂 귀: 귀의 모양, 크기, 두께를 중심으로 초년운, 중년운, 말년운 및 인복에 대한 설명을 작성.
                
                **3. 종합 조언 (Advice)**
                - 🎯 오늘의 키워드: 인상 관리를 위한 팁 (표정, 습관 등),
                - ⚠️ 주의사항: 3가지 이상을 명확하게 한 줄로 제시.
                - 💡 오늘의 조언: 한두 문장으로 핵심적인 메시지 전달.
                - 🌙 내일 미리보기: 긍정적인 변화를 위한 간단한 힌트.
                """;
    }
}
