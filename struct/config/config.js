require('dotenv/config');

module.exports = {
    //credentials
    token: process.env.TOKEN,
    devToken: process.env.DEVTOKEN,
    //support guild
    supportGuild: "https://discord.gg/rRA65Mn",
    //channels
    debug_channel: "634718645188034560",
    primary_test_channel: "617633098296721409",
    secondary_test_channel: "570531724002328577",
    devId: "360363051792203779",
    //misc
    embedColor: "",
    invite: "https://discordapp.com/api/oauth2/authorize?client_id=684109535312609409&permissions=3427328&scope=bot",
    //Settings
    devMode: false,
    prefix: "rx>",
    devPrefix: "-",
    volume: 5,
}
