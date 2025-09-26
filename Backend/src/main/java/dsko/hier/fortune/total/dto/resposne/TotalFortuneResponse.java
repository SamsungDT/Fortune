package dsko.hier.fortune.total.dto.resposne;

import dsko.hier.fortune.total.domain.Career;
import dsko.hier.fortune.total.domain.GoodLuck;
import dsko.hier.fortune.total.domain.Health;
import dsko.hier.fortune.total.domain.LoveAndMarriage;
import dsko.hier.fortune.total.domain.Personality;
import dsko.hier.fortune.total.domain.TotalFortune;
import dsko.hier.fortune.total.domain.TurningPoints;
import dsko.hier.fortune.total.domain.Wealth;
import java.util.UUID;
import lombok.Builder;

/**
 * 평생운세 응답 DTO
 */
@Builder
public record TotalFortuneResponse(
        UUID id,
        Personality personality,
        Wealth wealth,
        LoveAndMarriage loveAndMarriage,
        Career career,
        Health health,
        TurningPoints turningPoints,
        GoodLuck goodLuck
) {
    public static TotalFortuneResponse fromEnttiy(TotalFortune fortune) {
        return new TotalFortuneResponse(
                fortune.getId(),
                fortune.getPersonality(),
                fortune.getWealth(),
                fortune.getLoveAndMarriage(),
                fortune.getCareer(),
                fortune.getHealth(),
                fortune.getTurningPoints(),
                fortune.getGoodLuck()
        );
    }
}
