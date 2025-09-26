package dsko.hier.fortune.dream.dto;

import lombok.Getter;

public enum DeramKeyword {

    ANIMAL("동물"),
    FLYING("비행"),
    WATER("물"),
    FIRE("불"),
    MONEY("돈"),
    PERSON("사람"),
    HOUSE("집"),
    CAR("자동차"),
    FOOD("음식"),
    FLOWER("꽃"),
    MOUNTAIN("산"),
    SEA("바다"),
    SCHOOL("학교"),
    WORK("직장"),
    FAMILY("가족"),
    FRIENDS("친구");

    @Getter
    private final String korean;

    DeramKeyword(String korean) {
        this.korean = korean;
    }
}
