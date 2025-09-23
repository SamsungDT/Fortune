package dsko.hier.fortune.lifelongFortune.application;

import dsko.hier.fortune.lifelongFortune.domain.LifeLongFortune;
import dsko.hier.fortune.lifelongFortune.dto.resposne.AILifelongFortuneResponse;
import dsko.hier.global.exception.CustomExceptions.UserException;
import dsko.hier.global.exception.CustomExcpMsgs;
import dsko.hier.security.domain.User;
import dsko.hier.security.domain.UserRepository;
import java.lang.reflect.Field;
import java.util.Collection;
import java.util.Map;
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

    public AILifelongFortuneResponse getLieLongFortuneFromAI(String userEmail) {
        // 1. 사용자 정보 조회
        User user = userRepository.findByEmail(userEmail).orElseThrow(
                () -> new UserException(CustomExcpMsgs.USER_NOT_FOUND.getMessage())
        );

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
        PromptTemplate promptTemplate = new PromptTemplate(lifeLongFortunePromptBuilder());

        // 4. OpenAI API 호출 및 결과 저장
        AILifelongFortuneResponse entity = ChatClient.create(chatmodel)
                .prompt()
                .user(promptTemplate.create(params).getContents())
                .call()
                .entity(AILifelongFortuneResponse.class);

        assert entity != null;
        LifeLongFortune analyzeResult = new LifeLongFortune(user, entity);

        //우선 결과 출력
        LifelongFortunePrinter.printAllFortuneData(analyzeResult);

        return null;
    }

    // 프롬프트 템플릿을 문자열로 반환하는 메서드
    private String lifeLongFortunePromptBuilder() {
        return """
                당신은 전문가 수준의 역술가입니다.
                사용자가 요청한 이름과 생년월일을 바탕으로 평생 운세를 상세하고 따뜻하게 풀어주세요.
                
                각 운세 항목은 마크다운 형식을 사용하여 명확하게 구분해주세요.
                운세 내용은 긍정적이고 희망적인 어조로 작성하되, 조언과 실질적인 팁을 포함하여 사용자가 삶에 적용할 수 있도록 해주세요.
                운세 내용의 총 길이는 3000자 이상이 되도록 아주 상세히 문장으로 작성해주세요.
                
                **[요청 형식]**
                이름 : {name}
                생년 : {birthYear}
                생월 : {birthMonth}
                생일 : {birthDay}
                생시 : {birthTime}
                성별 : {sex}
                
                **[운세 항목]**
                🌟 {name}님의 평생 운세
                ---
                **🎂 타고난 성격과 재능**
                • 성격과 재능에 대한 구체적인 설명과 함께, 어떤 분야에서 강점을 보이는지 알려주세요.
                **💰 재물운**
                • 20대, 30대, 40대, 50대 이후로 시기를 나누어 재물운의 흐름과 투자 조언을 구체적으로 설명해주세요.
                **💕 연애운 & 결혼운**
                • 첫사랑 시기, 결혼 적령기, 배우자 특징 등 연애와 결혼에 대한 상세한 운세를 알려주세요.
                **🏆 사업운 & 직업운**
                • 성공할 분야, 커리어 전환 시기, 어울리는 리더십 스타일 등 직업적 조언을 구체적으로 설명해주세요.
                **🏥 건강운**
                • 타고난 건강 체질, 주의해야 할 부분, 추천하는 운동 등 건강 관리에 대한 조언을 알려주세요.
                **🌈 인생의 전환점**
                • 2~3번의 중요한 전환점을 나이와 함께 설명하고, 그 시기에 어떤 변화가 있을지 알려주세요.
                **💎 개운법**
                • 행운의 색깔, 행운의 숫자, 좋은 날, 피해야 할 것 등 실생활에서 적용할 수 있는 개운법을 알려주세요.
                
                **언어:** 한국어
                """;
    }

    public class LifelongFortunePrinter {

        public static void printAllFortuneData(LifeLongFortune fortune) {
            log.info("--- 평생 운세 정보 출력 시작 ---");
            try {
                printObjectDetails(fortune, 0);
            } catch (IllegalAccessException e) {
                log.error("Reflection을 통해 필드에 접근하는 중 오류가 발생했습니다.", e);
            }
            log.info("--- 평생 운세 정보 출력 종료 ---");
        }

        private static void printObjectDetails(Object object, int indentLevel) throws IllegalAccessException {
            if (object == null) {
                return;
            }

            String indent = " ".repeat(indentLevel * 4);
            Class<?> clazz = object.getClass();

            for (Field field : clazz.getDeclaredFields()) {
                field.setAccessible(true); // private 필드에 접근 허용
                Object value = field.get(object);

                if (value instanceof User) {
                    // User 엔티티의 순환 참조 방지를 위해 특정 필드만 출력
                    User user = (User) value;
                    log.info("{}User: email={}, name={}", indent, user.getEmail(), user.getName());
                } else if (isPrimitiveOrWrapper(value)) {
                    // 기본 타입 또는 String
                    log.info("{}{}: {}", indent, field.getName(), value);
                } else if (value instanceof Collection) {
                    // 컬렉션 타입 처리
                    log.info("{}{}:", indent, field.getName());
                    for (Object item : (Collection<?>) value) {
                        log.info("{}  - {}", indent, item);
                    }
                } else if (value != null) {
                    // 중첩된 객체 (Embedded) 처리
                    log.info("{}{}:", indent, field.getName());
                    printObjectDetails(value, indentLevel + 1);
                }
            }
        }

        private static boolean isPrimitiveOrWrapper(Object value) {
            return value == null || value.getClass().isPrimitive() || value instanceof Number || value instanceof String
                    || value instanceof Boolean;
        }
    }
}