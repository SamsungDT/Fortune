package dsko.hier.fortune.lifelongFortune.dto.resposne;

import dsko.hier.fortune.lifelongFortune.domain.Career;
import dsko.hier.fortune.lifelongFortune.domain.GoodLuck;
import dsko.hier.fortune.lifelongFortune.domain.Health;
import dsko.hier.fortune.lifelongFortune.domain.LifeLongFortune;
import dsko.hier.fortune.lifelongFortune.domain.LoveAndMarriage;
import dsko.hier.fortune.lifelongFortune.domain.Personality;
import dsko.hier.fortune.lifelongFortune.domain.TurningPoints;
import dsko.hier.fortune.lifelongFortune.domain.Wealth;

public record AILifelongFortuneResponse(
        Personality personality,
        Wealth wealth,
        LoveAndMarriage loveAndMarriage,
        Career career,
        Health health,
        TurningPoints turningPoints,
        GoodLuck goodLuck
) {
    public static AILifelongFortuneResponse fromEntity(LifeLongFortune entity) {
        if (entity == null) {
            return null;
        }
        return new AILifelongFortuneResponse(
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