package dsko.hier.fortune.dreamInterpretation.application;

import dsko.hier.fortune.application.PromptSupplier;
import dsko.hier.fortune.dreamInterpretation.domain.DreamAnalysis;
import dsko.hier.fortune.dreamInterpretation.domain.DreamAnalysisRepository;
import dsko.hier.fortune.dreamInterpretation.dto.DeramKeyword;
import dsko.hier.fortune.dreamInterpretation.dto.request.DreamRequestDto;
import dsko.hier.fortune.dreamInterpretation.dto.response.AIDreamResponse;
import dsko.hier.fortune.dreamInterpretation.dto.response.DreamResponse;
import dsko.hier.fortune.membership.application.UserPlanService;
import dsko.hier.global.exception.CustomExceptions.UserException;
import dsko.hier.global.exception.CustomExcpMsgs;
import dsko.hier.global.redis.RedisHashService;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRepository;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DreamInterpreationService {

    private final ChatModel chatmodel;
    private final UserRepository userRepository;
    private final DreamAnalysisRepository dreamAnalysisRepository;
    private final UserPlanService userPlanService;
    private final RedisHashService redisHashService;

    public DreamResponse getDreamResponseFromAI(String useremail, DreamRequestDto req) {
        log.info("꿈 해몽 서비스 시작");

        //1. 사용자 존재 여부 확인
        User user = userRepository.findByEmail(useremail).orElseThrow(
                () -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + useremail)
        );

        // 사용자 플랜 확인 및 무료 운세 카운트 감소
        if (!userPlanService.checkUserHaveRightIfHaveThenReduceCount(user.getEmail())) {
            throw new UserException(CustomExcpMsgs.FREE_FORTUNE_COUNT_EXCEEDED.getMessage());
        }

        //2. 꿈 해몽 분석
        log.info("꿈 해몽 분석 ai 요청 시작");

        StringBuilder sb = new StringBuilder();
        for (DeramKeyword keyword : req.keywords()) {
            sb.append(keyword.getKorean())
                    .append(", ");
        }
        String keyWord = sb.toString().replaceAll(", $", ""); // 마지막 쉼표와 공백 제거

        Map<String, Object> params = Map.of(
                "dream_description", req.dreamDescription(),
                "mood", req.dreamAtmosphere(),
                "keywords", keyWord
        );

        PromptTemplate promptTemplate = new PromptTemplate(PromptSupplier.dream());
        AIDreamResponse aiDreamResponse = ChatClient.create(chatmodel)
                .prompt()
                .user(promptTemplate.create(params).getContents())
                .call()
                .entity(AIDreamResponse.class);

        //레디스에 값 올리기.
        redisHashService.incrementFortuneCount(RedisHashService.DREAM_TYPE);

        log.info("꿈 해몽 분석 ai 요청 완료");
        return convertToDto(
                dreamAnalysisRepository.save(
                        convertToEntity(user, aiDreamResponse)
                )
        );
    }

    private DreamResponse convertToDto(DreamAnalysis dreamAnalysis) {
        return DreamResponse.builder()
                .summary(dreamAnalysis.getSummary())
                .symbolInterpretation(dreamAnalysis.getSymbolInterpretation())
                .psychologicalAnalysis(dreamAnalysis.getPsychologicalAnalysis())
                .fortuneProspects(dreamAnalysis.getFortuneProspects())
                .precautions(dreamAnalysis.getPrecautions())
                .adviceAndLuck(dreamAnalysis.getAdviceAndLuck())
                .specialMessage(dreamAnalysis.getSpecialMessage())
                .build();
    }

    private DreamAnalysis convertToEntity(User user, AIDreamResponse aiDreamResponse) {
        return DreamAnalysis.builder()
                .user(user)
                .aiResponse(aiDreamResponse)
                .build();
    }
}
