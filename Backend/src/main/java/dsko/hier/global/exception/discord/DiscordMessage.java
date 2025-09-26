package dsko.hier.global.exception.discord;

public record DiscordMessage(
        String content
) {

    public static DiscordMessage createDiscordMessage(String content) {
        return new DiscordMessage(content);
    }

}
