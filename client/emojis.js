module.exports = {
    name: 'emojis',
    async execute(client) {
        let customEmojis = {
            logo: "<:RadioX:688765708808487072>",
            eximiabots: "<:EximiaBots:693277919929303132>",
            list: "<:RadioXList:688541155519889482>",
            play: "<:RadioXPlay:688541155712827458>",
            stop: "<:RadioXStop:688541155377414168>",
            statistics: "<:RadioXStatistics:694954485507686421>",
            maintenance: "<:RadioXMaintenance:695043843057254493>",
            error: "<:RadioXError:688541155792781320>"
        };

        let fallbackEmojis = {
            logo: "RadioX",
            eximiabots: "EximiaBots",
            list: "📜",
            play: "▶️",
            stop: "⏹️",
            statistics: "📊",
            maintenance: "🛠️",
            error: "❌"
        };

        client.messageEmojis = {};

        for (customEmojiName in customEmojis) {
            customEmojiID = customEmojis[customEmojiName].replace(/[^0-9]+/g, '');
            customEmoji = client.emojis.cache.get(customEmojiID);
            if (customEmoji) {
                client.messageEmojis[customEmojiName] = customEmojis[customEmojiName];
            } else {
                client.messageEmojis[customEmojiName] = fallbackEmojis[customEmojiName];
            }
        }
    }
}