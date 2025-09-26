package dsko.hier.fortune.presentation;

import dsko.hier.fortune.dto.Statistics;
import dsko.hier.global.redis.RedisHashService;
import dsko.hier.global.redis.RedisUserCountService;
import dsko.hier.global.response.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/fortune/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final RedisHashService redisHashService;
    private final RedisUserCountService redisUserCountService;

    // StatisticsController.java 수정
    @GetMapping
    public APIResponse<Statistics> getStatistics() {
        // 1. Redis에서 사용자 수 가져오기
        int totalUserCount = redisUserCountService.getValue();

        // 2. Redis에서 운세 통계 정보 가져오기
        Integer dailyFortuneCnt = (Integer) redisHashService.getAllFortuneCounts()
                .get(RedisHashService.DAILY_FORTUNE_TYPE);
        if (dailyFortuneCnt == null) {
            dailyFortuneCnt = 0;
        }

        Integer lifeLongFortuneCnt = (Integer) redisHashService.getAllFortuneCounts()
                .get(RedisHashService.LIFE_LONG_FORTUNE_TYPE);
        if (lifeLongFortuneCnt == null) {
            lifeLongFortuneCnt = 0;
        }

        Integer faceFortuneCnt = (Integer) redisHashService.getAllFortuneCounts()
                .get(RedisHashService.FACE_TYPE);
        if (faceFortuneCnt == null) {
            faceFortuneCnt = 0;
        }

        Integer dreamFortuneCnt = (Integer) redisHashService.getAllFortuneCounts()
                .get(RedisHashService.DREAM_TYPE);
        if (dreamFortuneCnt == null) {
            dreamFortuneCnt = 0;
        }

        // 3. Statistics DTO 생성
        Statistics statistics = Statistics.builder()
                .totalUsers(totalUserCount)
                .dailyFortuneResultCount(dailyFortuneCnt)
                .lifeLongResultCount(lifeLongFortuneCnt)
                .faceResultCount(faceFortuneCnt)
                .dreamInterpretationResultCount(dreamFortuneCnt)
                .build();

        return APIResponse.success(statistics);
    }
}
