package dsko.hier.fortune.daily.application;

import dsko.hier.fortune.application.PromptSupplier;
import dsko.hier.fortune.daily.domain.DailyFortune;
import dsko.hier.fortune.daily.domain.DailyFortuneRepository;
import dsko.hier.fortune.daily.dto.response.AIDailyFortuneResponse;
import dsko.hier.fortune.daily.dto.response.DailyFortuneResponse;
import dsko.hier.fortune.membership.application.UserPlanService;
import dsko.hier.global.exception.CustomExceptions.UserException;
import dsko.hier.global.exception.CustomExcpMsgs;
import dsko.hier.global.redis.RedisHashService;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRepository;
import java.time.LocalDate;
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
public class DailyFortuneService {

    private final ChatModel chatmodel;
    private final UserRepository userRepository;
    private final DailyFortuneRepository dailyFortuneRepository;
    private final UserPlanService userPlanService;
    private final RedisHashService redisHashService;

    /**
     * 오늘의 운세 조회 서비스 1. 캐시에서 오늘의 운세가 있는지 확인 2. 캐시가 없으면 DB에서 오늘의 운세가 있는지 확인 (이미 생성된 운세) 3. DB에도 없으면 AI를 호출하여 새로운 오늘의 운세
     * 생성 4. 생성된 운세를 DB에 저장하고 캐시에 올림
     *
     * @param userEmail 사용자 이메일
     * @return 오늘의 운세 응답 DTO
     */
    public DailyFortuneResponse getTodaysFortuneFromAI(String userEmail) {
        log.info("캐시에서 오늘의 운세를 찾을 수 없어, 새로운 운세를 생성합니다.");

        // 1. 사용자 정보 조회
        User user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new UserException(CustomExcpMsgs.USER_NOT_FOUND.getMessage())
        );

        // 사용자 플랜 확인 및 무료 운세 카운트 감소
        if (!userPlanService.checkUserHaveRightIfHaveThenReduceCount(user.getEmail())) {
            throw new UserException(CustomExcpMsgs.FREE_FORTUNE_COUNT_EXCEEDED.getMessage());
        }

        // 2. DB에서 이미 생성된 오늘의 운세가 있는지 확인
        LocalDate today = LocalDate.now();

        Optional<DailyFortune> findResult = dailyFortuneRepository.findByFortuneDateAndUserEmail(today,
                userEmail);

        if (findResult.isEmpty()) {
            log.info("DB에서 오늘의 운세를 찾을 수 없어 AI 모델을 호출합니다.");

            Map<String, Object> params = Map.of(
                    "name", user.getName(),
                    "birthYear", user.getBirthInfo().getBirthYear(),
                    "birthMonth", user.getBirthInfo().getBirthMonth(),
                    "birthDay", user.getBirthInfo().getBirthDay(),
                    "birthTime", user.getBirthInfo().getBirthTime(),
                    "sex", user.getSex().toString()
            );

            PromptTemplate promptTemplate = new PromptTemplate(PromptSupplier.daily());
            AIDailyFortuneResponse aiResponse = ChatClient.create(chatmodel)
                    .prompt()
                    .user(promptTemplate.create(params).getContents())
                    .call()
                    .entity(AIDailyFortuneResponse.class);

            assert aiResponse != null;
            DailyFortune dailyFortune = AIDailyFortuneResponse.toEntity(user, aiResponse);
            dailyFortuneRepository.save(dailyFortune);
            //레디스에 값 올리기.
            redisHashService.incrementFortuneCount(RedisHashService.DAILY_FORTUNE_TYPE);
            return DailyFortuneResponse.fromEntity(dailyFortune);
        } else {
            log.info("DB에서 오늘의 운세를 찾았습니다.");
            return DailyFortuneResponse.fromEntity(findResult.get());
        }
    }
}