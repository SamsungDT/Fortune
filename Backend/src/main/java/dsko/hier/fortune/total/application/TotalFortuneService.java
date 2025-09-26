package dsko.hier.fortune.total.application;

import dsko.hier.fortune.application.PromptSupplier;
import dsko.hier.fortune.membership.application.UserPlanService;
import dsko.hier.fortune.total.domain.TotalFortune;
import dsko.hier.fortune.total.domain.TotalFortuneRepository;
import dsko.hier.fortune.total.dto.resposne.AITotalFortuneResponse;
import dsko.hier.fortune.total.dto.resposne.TotalFortuneResponse;
import dsko.hier.global.exception.CustomExceptions.UserException;
import dsko.hier.global.exception.CustomExcpMsgs;
import dsko.hier.global.redis.RedisHashService;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRepository;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class TotalFortuneService {

    private final ChatModel chatmodel;
    private final UserRepository userRepository;
    private final TotalFortuneRepository totalFortuneRepository;
    private final UserPlanService userPlanService;
    private final RedisHashService redisHashService;

    public TotalFortuneResponse getLieLongFortuneFromAI(String userEmail) {
        // 1. 사용자 정보 조회
        User user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new UserException(CustomExcpMsgs.USER_NOT_FOUND.getMessage())
        );

        log.info("사용자 {}의 이전 운세 기록 확인 시도", userEmail);
        Optional<TotalFortune> searchResult = totalFortuneRepository.findByUserEmail(userEmail);
        if (searchResult.isPresent()) {
            log.info("사용자 {}의 이전 운세 기록이 존재하여, 기존 기록 반환", userEmail);
            return TotalFortuneResponse.fromEnttiy(searchResult.get());
        }

        log.info("사용자 {}의 이전 운세 기록이 존재하지 않아, 새로운 운세 기록 생성 시작", userEmail);
        // 사용자 플랜 확인 및 무료 운세 카운트 감소
        if (!userPlanService.checkUserHaveRightIfHaveThenReduceCount(user.getEmail())) {
            throw new UserException(CustomExcpMsgs.FREE_FORTUNE_COUNT_EXCEEDED.getMessage());
        }

        // 2. 프롬프트에 들어갈 파라미터 설정
        Map<String, Object> params = Map.of(
                "name", user.getName(),
                "birthYear", user.getBirthInfo().getBirthYear(),
                "birthMonth", user.getBirthInfo().getBirthMonth(),
                "birthDay", user.getBirthInfo().getBirthDay(),
                "birthTime", user.getBirthInfo().getBirthTime(),
                "sex", user.getSex().toString()
        );

        // 3. PromptTemplate을 사용하여 프롬프트 생성
        PromptTemplate promptTemplate = new PromptTemplate(PromptSupplier.total());

        // 4. OpenAI API 호출 및 결과 저장
        AITotalFortuneResponse entity = ChatClient.create(chatmodel)
                .prompt()
                .user(promptTemplate.create(params).getContents())
                .call()
                .entity(AITotalFortuneResponse.class);

        //레디스에 값 올리기.
        redisHashService.incrementFortuneCount(RedisHashService.LIFE_LONG_FORTUNE_TYPE);

        assert entity != null;
        TotalFortune savedResult = totalFortuneRepository.save(new TotalFortune(user, entity));

        return TotalFortuneResponse.fromEnttiy(savedResult);
    }


}