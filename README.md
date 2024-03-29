# RadioX by EximiaBots
Internet Radio to your Discord guild

## [Radio Stations List](https://git.cwinfo.net/cwchristerw/radio)
This bot is using Gitea repo to get radio stations from [playlist.json](https://git.cwinfo.net/cwchristerw/radio/raw/branch/master/playlist.json) file. List is currently maintained by Christer Warén. You can use alternative list with same format when using RADIOX_STATIONSLISTURL environment variable.

## Docker

### 1. Build Image

**Production**
```
docker build -t warengroup/eximiabots-radiox:latest . --pull
```

**Beta**
```
docker build -t warengroup/eximiabots-radiox:latest-beta . --pull
```

**Dev**
```
docker build -t warengroup/eximiabots-radiox:latest-dev . --pull
```

### 2. Run Container

**Production**
```
docker run --name radiox --net host -d -e DISCORD_TOKEN= -e STREAMER_MODE=auto -v "$PWD/datastore":/usr/src/app/datastore/ warengroup/eximiabots-radiox:latest
```

**Beta**
```
docker run --name radiox --net host -d -e DISCORD_TOKEN= -e STREAMER_MODE=auto -v "$PWD/datastore":/usr/src/app/datastore/ warengroup/eximiabots-radiox:latest-beta
```

**Dev**
```
docker run --rm --name radiox-dev --net host -e DISCORD_TOKEN= -e DEV_MODE=true -v "$PWD":/usr/src/app/ warengroup/eximiabots-radiox:latest-dev
```


## Join our Discord Server
https://discord.gg/rRA65Mn
