require('dotenv/config');

module.exports = {

    //credentials
    token: process.env.DISCORD_TOKEN,

    //radio stations
    stationslistUrl: process.env.RADIOX_STATIONSLISTURL || "https://gitea.cwinfo.org/cwchristerw/radio/raw/branch/master/playlist.json",

    //support
    supportGuild: "https://discord.gg/rRA65Mn",
    devId: [
        "493174343484833802",
        "360363051792203779"
    ],

    //misc
    embedColor: "#88aa00",
    hostedBy: "[Warén Group](https://waren.io)",

    //Settings
    version: process.env.RADIOX_VERSION || process.env.npm_package_version,
    debug: process.env.DEBUG_MODE || false

}