package dsko.hier.fortune.face.application;

import dsko.hier.fortune.application.PromptSupplier;
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

        PromptTemplate promptTemplate = new PromptTemplate(PromptSupplier.face());
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
        Face savedResult = faceRepository.save(Face.toEntity(user, aiResponse));
        log.info("저장 완료: {}", savedResult);
        // 4. 분석 결과 반환
        return FaceAnalyzeResponse.fromEntity(savedResult);
    }
}
