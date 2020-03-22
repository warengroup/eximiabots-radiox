module.exports = {
    name: 'emojis',
    async execute(client) {
        let customEmojis = {
            list: "<:RadioXList:688541155519889482>",
            play: "<:RadioXPlay:688541155712827458>",
            stop: "<:RadioXStop:688541155377414168>",
            x: "<:RadioXX:688541155792781320>"
        };

        let fallbackEmojis = {
            list: "📜",
            play: "▶️",
            stop: "⏹️",
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