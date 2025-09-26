package dsko.hier.fortune.total.dto.resposne;

import dsko.hier.fortune.total.domain.Career;
import dsko.hier.fortune.total.domain.GoodLuck;
import dsko.hier.fortune.total.domain.Health;
import dsko.hier.fortune.total.domain.LoveAndMarriage;
import dsko.hier.fortune.total.domain.Personality;
import dsko.hier.fortune.total.domain.TotalFortune;
import dsko.hier.fortune.total.domain.TurningPoints;
import dsko.hier.fortune.total.domain.Wealth;

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
}