import RadioClient from "../Client";

export const emojis = {
    name: 'emojis',
    async execute(client: RadioClient): Promise<any> {
        let customEmojis: any = {
            logo: "<:RadioX:688765708808487072>",
            eximiabots: "<:EximiaBots:693277919929303132>",
            list: "<:RadioXList:688541155519889482>",
            play: "<:RadioXPlay:688541155712827458>",
            stop: "<:RadioXStop:688541155377414168>",
            statistics: "<:RadioXStatistics:694954485507686421>",
            maintenance: "<:RadioXMaintenance:695043843057254493>",
            error: "<:RadioXError:688541155792781320>",
            prev: "<:RadioXPrev:882153637370023957>",
            next: "<:RadioXNext:882153637474893834>"
        };

        let fallbackEmojis: any = {
            logo: "RadioX",
            eximiabots: "EximiaBots",
            list: "📜",
            play: "▶️",
            stop: "⏹️",
            statistics: "📊",
            maintenance: "🛠️",
            error: "❌",
            prev: "⏪",
            next: "⏩"
        };

        client.messageEmojis = {};

        for (const customEmojiName in customEmojis) {
            const customEmojiID = customEmojis[customEmojiName].replace(/[^0-9]+/g, '');
            const customEmoji = client.emojis.cache.get(customEmojiID);
            if (customEmoji) {
                client.messageEmojis[customEmojiName] = customEmojis[customEmojiName];
            } else {
                client.messageEmojis[customEmojiName] = fallbackEmojis[customEmojiName];
            }
        }
    }
}
