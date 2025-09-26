package dsko.hier.fortune.dto.ai;

import dsko.hier.fortune.domain.totalDomain.Career;
import dsko.hier.fortune.domain.totalDomain.GoodLuck;
import dsko.hier.fortune.domain.totalDomain.Health;
import dsko.hier.fortune.domain.totalDomain.LoveAndMarriage;
import dsko.hier.fortune.domain.totalDomain.Personality;
import dsko.hier.fortune.domain.totalDomain.TotalFortune;
import dsko.hier.fortune.domain.totalDomain.TurningPoints;
import dsko.hier.fortune.domain.totalDomain.Wealth;
import dsko.hier.security.domain.User;

public record AITotalFortuneResponse(
        Personality personality,
        Wealth wealth,
        LoveAndMarriage loveAndMarriage,
        Career career,
        Health health,
        TurningPoints turningPoints,
        GoodLuck goodLuck
) {
    public static AITotalFortuneResponse fromEntity(TotalFortune entity) {
        if (entity == null) {
            return null;
        }
        return new AITotalFortuneResponse(
                entity.getPersonality(),
                entity.getWealth(),
                entity.getLoveAndMarriage(),
                entity.getCareer(),
                entity.getHealth(),
                entity.getTurningPoints(),
                entity.getGoodLuck()
        );
    }

    public static TotalFortune toEntity(User user, AITotalFortuneResponse response) {
        return new TotalFortune(
                user,
                response.personality(),
                response.wealth(),
                response.loveAndMarriage(),
                response.career(),
                response.health(),
                response.turningPoints(),
                response.goodLuck()
        );
    }
}