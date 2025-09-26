package dsko.hier.fortune.dto;

import dsko.hier.fortune.domain.totalDomain.Career;
import dsko.hier.fortune.domain.totalDomain.GoodLuck;
import dsko.hier.fortune.domain.totalDomain.Health;
import dsko.hier.fortune.domain.totalDomain.LoveAndMarriage;
import dsko.hier.fortune.domain.totalDomain.Personality;
import dsko.hier.fortune.domain.totalDomain.TotalFortune;
import dsko.hier.fortune.domain.totalDomain.TurningPoints;
import dsko.hier.fortune.domain.totalDomain.Wealth;
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
    public static TotalFortuneResponse fromEntity(TotalFortune fortune) {
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
