package dsko.hier.fortune.presentation;

import dsko.hier.fortune.domain.dailyDomain.DailyFortuneRepository;
import dsko.hier.fortune.domain.dreamDomain.DreamAnalysisRepository;
import dsko.hier.fortune.domain.faceDomain.FaceRepository;
import dsko.hier.fortune.domain.totalDomain.TotalFortuneRepository;
import dsko.hier.fortune.dto.AllOfMyResultResponse;
import dsko.hier.fortune.dto.AllOfMyResultResponse.ResultType;
import dsko.hier.fortune.dto.AllOfMyResultResponse.SimpleResult;
import dsko.hier.fortune.dto.Statistics;
import dsko.hier.global.redis.RedisHashService;
import dsko.hier.global.redis.RedisUserCountService;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class StatisticsService {

    private final RedisHashService redisHashService;
    private final RedisUserCountService redisUserCountService;
    private final FaceRepository faceRepository;
    private final DailyFortuneRepository dailyFortuneRepository;
    private final DreamAnalysisRepository dreamRepository;
    private final TotalFortuneRepository totalFortuneRepository;

    public Statistics getStatistics() {
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
        return Statistics.builder()
                .totalUsers(totalUserCount)
                .dailyFortuneResultCount(dailyFortuneCnt)
                .lifeLongResultCount(lifeLongFortuneCnt)
                .faceResultCount(faceFortuneCnt)
                .dreamInterpretationResultCount(dreamFortuneCnt)
                .build();
    }

    public AllOfMyResultResponse findAllOfMyResult(String username) {
        List<SimpleResult> result = new ArrayList<>();
        // 1. 각 리포지토리에서 사용자 결과 가져오기
        faceRepository.findAllByUserEmail(username)
                .forEach(
                        face -> result.add(new SimpleResult(
                                ResultType.FACE,
                                face.getId(),
                                face.getCreatedAt().toString()
                        ))
                );
        dailyFortuneRepository.findAllByUserEmail(username)
                .forEach(
                        dailyFortune -> result.add(new SimpleResult(
                                ResultType.DAILY_FORTUNE,
                                dailyFortune.getId(),
                                dailyFortune.getCreatedAt().toString()
                        ))
                );
        dreamRepository.findAllByUserEmail(username)
                .forEach(
                        dreamAnalysis -> result.add(new SimpleResult(
                                ResultType.DREAM,
                                dreamAnalysis.getId(),
                                dreamAnalysis.getCreatedAt().toString()
                        ))
                );
        totalFortuneRepository.findAllByUserEmail(username)
                .forEach(
                        totalFortune -> result.add(new SimpleResult(
                                ResultType.LIFE_LONG,
                                totalFortune.getId(),
                                totalFortune.getCreatedAt().toString()
                        ))
                );

        // 반환
        return new AllOfMyResultResponse(result);
    }
}
