# RadioX by EximiaBots
Internet Radio to your Discord guild

## [Radio Stations List](https://gitea.cwinfo.org/cwchristerw/radio)
This bot is using Gitea repo to get radio stations from [playlist.json](https://gitea.cwinfo.org/cwchristerw/radio/raw/branch/master/playlist.json) file. List is currently maintained by Christer Warén. You can use alternative list with same format when using RADIOX_STATIONSLISTURL environment variable.

## Docker
1. `docker build -t warengroup/eximiabots-radiox . --pull`
2. `docker run --name radiox-dev -d --net host -e DISCORD_TOKEN= -v "$PWD/datastore":/usr/src/app/datastore/ warengroup/eximiabots-radiox`

## Join our Discord Server
https://discord.gg/rRA65Mn
