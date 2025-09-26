package dsko.hier.fortune.todayfortune.application;

import dsko.hier.fortune.application.PromptSupplier;
import dsko.hier.fortune.membership.application.UserPlanService;
import dsko.hier.fortune.todayfortune.domain.DailyFortune;
import dsko.hier.fortune.todayfortune.domain.DailyFortuneRepository;
import dsko.hier.fortune.todayfortune.dto.response.AIDailyFortuneResponse;
import dsko.hier.fortune.todayfortune.dto.response.DailyFortuneResponse;
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
            DailyFortune dailyFortune = new DailyFortune(user, today, aiResponse);
            dailyFortuneRepository.save(dailyFortune);
            return convertToDto(dailyFortune);
        } else {
            log.info("DB에서 오늘의 운세를 찾았습니다.");
            return convertToDto(findResult.get());
        }
    }

    private DailyFortuneResponse convertToDto(DailyFortune fortune) {
        DailyFortuneResponse.Wealth wealthResponseDto = DailyFortuneResponse.Wealth.builder()
                .wealthSummary(fortune.getFortuneWealth().getWealthSummary())
                .wealthTip1(fortune.getFortuneWealth().getWealthTip1())
                .wealthTip2(fortune.getFortuneWealth().getWealthTip2())
                .lottoNumbers(fortune.getFortuneWealth().getLottoNumbers())
                .build();

        DailyFortuneResponse.Love loveResponseDto = DailyFortuneResponse.Love.builder()
                .single(fortune.getFortuneLove().getSingle())
                .inRelationship(fortune.getFortuneLove().getInRelationship())
                .married(fortune.getFortuneLove().getMarried())
                .build();

        DailyFortuneResponse.Career careerResponseDto = DailyFortuneResponse.Career.builder()
                .tip1(fortune.getFortuneCareer().getTip1())
                .tip2(fortune.getFortuneCareer().getTip2())
                .tip3(fortune.getFortuneCareer().getTip3())
                .tip4(fortune.getFortuneCareer().getTip4())
                .build();

        DailyFortuneResponse.Health healthResponseDto = DailyFortuneResponse.Health.builder()
                .tip1(fortune.getFortuneHealth().getTip1())
                .tip2(fortune.getFortuneHealth().getTip2())
                .tip3(fortune.getFortuneHealth().getTip3())
                .tip4(fortune.getFortuneHealth().getTip4())
                .build();

        DailyFortuneResponse.Keywords keywordsResponseDto = DailyFortuneResponse.Keywords.builder()
                .luckyColors(fortune.getFortuneKeywords().getLuckyColors())
                .luckyNumbers(fortune.getFortuneKeywords().getLuckyNumbers())
                .luckyTimes(fortune.getFortuneKeywords().getLuckyTimes())
                .luckyDirection(fortune.getFortuneKeywords().getLuckyDirection())
                .goodFoods(fortune.getFortuneKeywords().getGoodFoods())
                .build();

        DailyFortuneResponse.Precautions precautionsResponseDto = DailyFortuneResponse.Precautions.builder()
                .precaution1(fortune.getFortunePrecautions().getPrecaution1())
                .precaution2(fortune.getFortunePrecautions().getPrecaution2())
                .precaution3(fortune.getFortunePrecautions().getPrecaution3())
                .precaution4(fortune.getFortunePrecautions().getPrecaution4())
                .build();

        DailyFortuneResponse.Advice adviceResponseDto = DailyFortuneResponse.Advice.builder()
                .adviceText(fortune.getFortuneAdvice().getAdviceText())
                .build();

        //레디스에 값 올리기.
        redisHashService.incrementFortuneCount(RedisHashService.DAILY_FORTUNE_TYPE);

        return DailyFortuneResponse.builder()
                .id(fortune.getId())
                .fortuneDate(fortune.getFortuneDate())
                .overallRating(fortune.getOverallRating())
                .overallSummary(fortune.getOverallSummary())
                .wealth(wealthResponseDto)
                .love(loveResponseDto)
                .career(careerResponseDto)
                .health(healthResponseDto)
                .keywords(keywordsResponseDto)
                .precautions(precautionsResponseDto)
                .advice(adviceResponseDto)
                .tomorrowPreview(fortune.getTomorrowPreview())
                .build();
    }
}