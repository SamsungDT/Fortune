package dsko.hier.fortune.application;

import dsko.hier.fortune.application.pattern.FortuneContext;
import dsko.hier.fortune.application.strategy.DreamInterpreationStrategy;
import dsko.hier.fortune.application.strategy.FaceStrategy;
import dsko.hier.fortune.application.strategy.TotalStrategy;
import dsko.hier.fortune.domain.dailyDomain.DailyFortune;
import dsko.hier.fortune.domain.dailyDomain.DailyFortuneRepository;
import dsko.hier.fortune.domain.dreamDomain.DreamAnalysis;
import dsko.hier.fortune.domain.dreamDomain.DreamAnalysisRepository;
import dsko.hier.fortune.domain.faceDomain.Face;
import dsko.hier.fortune.domain.faceDomain.FaceRepository;
import dsko.hier.fortune.domain.totalDomain.TotalFortune;
import dsko.hier.fortune.domain.totalDomain.TotalFortuneRepository;
import dsko.hier.fortune.dto.DailyFortuneResponse;
import dsko.hier.fortune.dto.DreamRequestDto;
import dsko.hier.fortune.dto.DreamResponse;
import dsko.hier.fortune.dto.FaceAnalyzeRequest;
import dsko.hier.fortune.dto.FaceAnalyzeResponse;
import dsko.hier.fortune.dto.TotalFortuneResponse;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class FortuneAnalyzeService {

    private final FortuneContext fortuneContext;

    private final DailyFortuneRepository dailyFortuneRepository;
    private final TotalFortuneRepository totalFortuneRepository;
    private final FaceRepository faceRepository;
    private final DreamAnalysisRepository dreamRepository;

    private final FaceStrategy faceStrategy;
    private final dsko.hier.fortune.daily.application.DailyFortuneStrategy dailyFortuneStrategy;
    private final DreamInterpreationStrategy dreamInterpreationStrategy;
    private final TotalStrategy totalStrategy;

    public FaceAnalyzeResponse getFaceAnalyzeResultOfUser(String userEmail, FaceAnalyzeRequest request) {
        return fortuneContext.getFortune(userEmail, faceStrategy, request);
    }

    public DreamResponse getDreamInterpretationOfUser(String useremail, DreamRequestDto req) {
        return fortuneContext.getFortune(useremail, dreamInterpreationStrategy, req);
    }

    public DailyFortuneResponse getDailyFortuneOfUser(String userEmail) {
        Optional<DailyFortune> findResult = dailyFortuneRepository.findByFortuneDateAndUserEmail(
                userEmail,
                LocalDateTime.now()
        );

        if (findResult.isPresent()) {
            log.info("DB에서 오늘의 운세를 찾았습니다.");
            return DailyFortuneResponse.fromEntity(findResult.get());
        }

        log.info("DB에서 오늘의 운세를 찾을 수 없어 AI 모델을 호출합니다.");
        return fortuneContext.getFortune(userEmail, dailyFortuneStrategy, null);
    }


    public TotalFortuneResponse getTotalFortuneOfUser(String userEmail) {

        Optional<TotalFortune> byUserEmail = totalFortuneRepository.findByUserEmail(userEmail);
        if (byUserEmail.isPresent()) {
            log.info("사용자 {}의 이전 운세 기록이 존재하여, 기존 기록 반환", userEmail);
            return TotalFortuneResponse.fromEntity(byUserEmail.get());
        }

        log.info("사용자 {}의 이전 평생 운세 기록이 존재하지 않아, 새로운 운세 기록 생성 시작", userEmail);

        return fortuneContext.getFortune(userEmail, totalStrategy, null);
    }

    public FaceAnalyzeResponse getFaceResultById(UUID resultId) {
        Face face = faceRepository.findById(resultId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 얼굴 분석 결과가 존재하지 않습니다."));
        return FaceAnalyzeResponse.fromEntity(face);
    }

    public DreamResponse getDreamResultById(UUID resultId) {
        DreamAnalysis dreamAnalysis = dreamRepository.findById(resultId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 꿈 해몽 결과가 존재하지 않습니다."));

        return DreamResponse.fromEntity(dreamAnalysis);
    }

    public DailyFortuneResponse getDailyResultById(UUID resultId) {
        DailyFortune dailyFortune = dailyFortuneRepository.findById(resultId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 오늘의 운세 결과가 존재하지 않습니다."));
        return DailyFortuneResponse.fromEntity(dailyFortune);
    }

    public TotalFortuneResponse getTotalResultById(UUID resultId) {
        TotalFortune totalFortune = totalFortuneRepository.findById(resultId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 평생 운세 결과가 존재하지 않습니다."));
        return TotalFortuneResponse.fromEntity(totalFortune);
    }
}
