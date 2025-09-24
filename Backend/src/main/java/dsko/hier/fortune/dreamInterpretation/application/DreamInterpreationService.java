package dsko.hier.fortune.dreamInterpretation.application;

import dsko.hier.fortune.dreamInterpretation.domain.DreamAnalysis;
import dsko.hier.fortune.dreamInterpretation.domain.DreamAnalysisRepository;
import dsko.hier.fortune.dreamInterpretation.dto.DeramKeyword;
import dsko.hier.fortune.dreamInterpretation.dto.request.DreamRequestDto;
import dsko.hier.fortune.dreamInterpretation.dto.response.AIDreamResponse;
import dsko.hier.fortune.dreamInterpretation.dto.response.DreamResponse;
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

    public DreamResponse getDreamResponseFromAI(String useremail, DreamRequestDto req) {
        log.info("꿈 해몽 서비스 시작");

        //1. 사용자 존재 여부 확인
        User user = userRepository.findByEmail(useremail).orElseThrow(
                () -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + useremail)
        );

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

        PromptTemplate promptTemplate = new PromptTemplate(dreamAnalysisPromptBuilder());
        AIDreamResponse aiDreamResponse = ChatClient.create(chatmodel)
                .prompt()
                .user(promptTemplate.create(params).getContents())
                .call()
                .entity(AIDreamResponse.class);

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

    private String dreamAnalysisPromptBuilder() {
        return """
                당신은 저명한 심리학자이자 전문적인 꿈 해몽가입니다.
                사용자가 제공한 꿈의 내용과 분위기를 바탕으로 심리 상태를 분석하고, 미래에 대한 희망적인 메시지와 실질적인 조언을 제공해주세요.
                
                각 항목은 마크다운 형식을 사용하여 명확하게 구분해주세요.
                분석 내용은 긍정적이고 따뜻한 어조로 작성하되, 사용자가 자신의 삶에 적용할 수 있는 구체적인 팁을 포함하여 3000자 이상으로 매우 상세하게 작성해주세요.
                
                **[요청 형식]**
                꿈의 분위기: {mood}
                꿈의 핵심 키워드: {keywords}
                꿈의 상세 내용: {dream_description}
                
                **[꿈 해몽 항목]**
                🌙 꿈 해몽 분석
                ---
                📝 꿈의 요약
                • 꿈의 전체적인 분위기({mood})가 당신의 현재 심리 상태에 어떤 영향을 미치는지 설명해주세요.
                🔍 주요 상징 해석
                • 꿈의 핵심 키워드({keywords})를 중심으로, 해당 상징들이 현실의 어떤 의미를 가지는지 구체적으로 해석해주세요.
                🎯 심리 상태 분석
                • 현재 당신이 겪고 있는 내면의 변화나 고민, 무의식적 욕구에 대해 4가지 이상 구체적인 문장으로 분석해주세요.
                🔮 운세 전망
                • 단기(1개월), 중기(3개월), 장기(1년)로 나누어, 꿈이 예고하는 미래의 운세 흐름을 긍정적인 방향으로 풀어주세요.
                ⚠️ 주의사항
                • 꿈이 암시하는 위험 신호나 주의해야 할 점을 3가지 이상 구체적인 조언으로 제시해주세요.
                💡 조언 및 개운법
                • 꿈의 메시지를 현실에 적용하여 운을 좋게 만드는 구체적인 행동(명상, 색상, 음식 등)을 5가지 이상 제시해주세요.
                🌟 특별 메시지
                • 꿈이 보내는 희망적이고 따뜻한 메시지를 담아 마지막으로 한두 문장의 특별 메시지를 작성해주세요.
                
                **언어:** 한국어
                """;
    }
}
