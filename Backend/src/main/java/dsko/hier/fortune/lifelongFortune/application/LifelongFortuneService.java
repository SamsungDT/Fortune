package dsko.hier.fortune.lifelongFortune.application;

import dsko.hier.fortune.application.PromptSupplier;
import dsko.hier.fortune.lifelongFortune.domain.LifeLongFortune;
import dsko.hier.fortune.lifelongFortune.domain.LifeLongFortuneRepository;
import dsko.hier.fortune.lifelongFortune.dto.resposne.AILifelongFortuneResponse;
import dsko.hier.fortune.lifelongFortune.dto.resposne.LifelongFortuneResponse;
import dsko.hier.fortune.lifelongFortune.dto.resposne.LifelongFortuneResponse.Career;
import dsko.hier.fortune.lifelongFortune.dto.resposne.LifelongFortuneResponse.GoodLuck;
import dsko.hier.fortune.lifelongFortune.dto.resposne.LifelongFortuneResponse.Health;
import dsko.hier.fortune.lifelongFortune.dto.resposne.LifelongFortuneResponse.LoveAndMarriage;
import dsko.hier.fortune.lifelongFortune.dto.resposne.LifelongFortuneResponse.Personality;
import dsko.hier.fortune.lifelongFortune.dto.resposne.LifelongFortuneResponse.TurningPoints;
import dsko.hier.fortune.lifelongFortune.dto.resposne.LifelongFortuneResponse.Wealth;
import dsko.hier.fortune.membership.application.UserPlanService;
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
public class LifelongFortuneService {

    private final ChatModel chatmodel;
    private final UserRepository userRepository;
    private final LifeLongFortuneRepository lifeLongFortuneRepository;
    private final UserPlanService userPlanService;
    private final RedisHashService redisHashService;

    public LifelongFortuneResponse getLieLongFortuneFromAI(String userEmail) {
        // 1. 사용자 정보 조회
        User user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new UserException(CustomExcpMsgs.USER_NOT_FOUND.getMessage())
        );

        log.info("사용자 {}의 이전 운세 기록 확인 시도", userEmail);
        Optional<LifeLongFortune> searchResult = lifeLongFortuneRepository.findByUserEmail(userEmail);
        if (searchResult.isPresent()) {
            log.info("사용자 {}의 이전 운세 기록이 존재하여, 기존 기록 반환", userEmail);
            return covertToDto(searchResult.get());
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
        AILifelongFortuneResponse entity = ChatClient.create(chatmodel)
                .prompt()
                .user(promptTemplate.create(params).getContents())
                .call()
                .entity(AILifelongFortuneResponse.class);

        //레디스에 값 올리기.
        redisHashService.incrementFortuneCount(RedisHashService.LIFE_LONG_FORTUNE_TYPE);

        assert entity != null;
        LifeLongFortune savedResult = lifeLongFortuneRepository.save(new LifeLongFortune(user, entity));

        //5. Dto로 변환 후 반환
        return covertToDto(savedResult);
    }

    private LifelongFortuneResponse covertToDto(LifeLongFortune fortune) {

        Personality personalityResponseDto = Personality.builder()
                .strength(fortune.getPersonality().getStrength())
                .talent(fortune.getPersonality().getTalent())
                .responsibility(fortune.getPersonality().getResponsibility())
                .empathy(fortune.getPersonality().getEmpathy())
                .build();
        Wealth wealthResponseDto = Wealth.builder()
                .twenties(fortune.getWealth().getTwenties())
                .thirties(fortune.getWealth().getThirties())
                .forties(fortune.getWealth().getForties())
                .fiftiesAndBeyond(fortune.getWealth().getFiftiesAndBeyond())
                .build();

        LoveAndMarriage loveAndMarriageResponseDto = LoveAndMarriage.builder()
                .firstLove(fortune.getLoveAndMarriage().getFirstLove())
                .marriageAge(fortune.getLoveAndMarriage().getMarriageAge())
                .spouseMeeting(fortune.getLoveAndMarriage().getSpouseMeeting())
                .marriedLife(fortune.getLoveAndMarriage().getMarriedLife())
                .build();

        Career careerResponseDto = Career.builder()
                .successfulFields(fortune.getCareer().getSuccessfulFields())
                .careerChangeAge(fortune.getCareer().getCareerChangeAge())
                .leadershipStyle(fortune.getCareer().getLeadershipStyle())
                .build();

        Health buildResponseDto = Health.builder()
                .generalHealth(fortune.getHealth().getGeneralHealth())
                .weakPoint(fortune.getHealth().getWeakPoint())
                .checkupReminder(fortune.getHealth().getCheckupReminder())
                .recommendedExercise(fortune.getHealth().getRecommendedExercise())
                .build();

        TurningPoints turningPointResponseDto = TurningPoints.builder()
                .first(fortune.getTurningPoints().getEin())
                .second(fortune.getTurningPoints().getZwei())
                .third(fortune.getTurningPoints().getDrei())
                .build();

        GoodLuck goodLuckResponseDto = GoodLuck.builder()
                .luckyColors(fortune.getGoodLuck().getLuckyColors())
                .luckyNumbers(fortune.getGoodLuck().getLuckyNumbers())
                .luckyDirection(fortune.getGoodLuck().getLuckyDirection())
                .goodDays(fortune.getGoodLuck().getGoodDays())
                .avoidances(fortune.getGoodLuck().getAvoidances())
                .build();

        return LifelongFortuneResponse.builder()
                .personality(personalityResponseDto)
                .wealth(wealthResponseDto)
                .loveAndMarriage(loveAndMarriageResponseDto)
                .career(careerResponseDto)
                .health(buildResponseDto)
                .turningPoints(turningPointResponseDto)
                .goodLuck(goodLuckResponseDto)
                .build();
    }


}