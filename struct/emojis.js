module.exports = {
    name: 'emojis',
    async execute(client) {
        let customEmojis = {
            logo: "<:RadioX:688765708808487072>",
            eximiabots: "<:EximiaBots:693277919929303132>",
            list: "<:RadioXList:688541155519889482>",
            play: "<:RadioXPlay:688541155712827458>",
            stop: "<:RadioXStop:688541155377414168>",
            statistics: "<:RadioXStatistics:000000000000000000>",
            maintenance: "<:RadioXMaintenance:000000000000000000>",
            x: "<:RadioXX:688541155792781320>"
        };

        let fallbackEmojis = {
            logo: "RadioX",
            eximiabots: "EximiaBots",
            list: "📜",
            play: "▶️",
            stop: "⏹️",
            statistics: "📊",
            maintenance: "🛠️",
            x: "❌"
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