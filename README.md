# RadioX by EximiaBots
Internet Radio to your Discord guild

## [Radio Stations List](https://git.cwinfo.net/cwchristerw/radio)
This bot is using Gitea repo to get radio stations from [playlist.json](https://git.cwinfo.net/cwchristerw/radio/raw/branch/master/playlist.json) file. List is currently maintained by Christer Warén. You can use alternative list with same format when using RADIOX_STATIONSLISTURL environment variable.

## Docker

### 1. Build Image

**Production**
```
docker build -t warengroup/eximiabots-radiox:0.3.20 . --pull
```

**Beta**
```
docker build -t warengroup/eximiabots-radiox:0.3.20-beta . --pull
```

**Dev**
```
docker build -t warengroup/eximiabots-radiox:0.3.20-dev . --pull
```

### 2. Run Container

**Production**
```
docker run --name radiox --net host -d -e DISCORD_TOKEN= -e STREAMER_MODE=auto -v "$PWD/datastore":/usr/src/app/datastore/ warengroup/eximiabots-radiox:0.3.20
```

**Beta**
```
docker run --name radiox --net host -d -e DISCORD_TOKEN= -e STREAMER_MODE=auto -v "$PWD/datastore":/usr/src/app/datastore/ warengroup/eximiabots-radiox:0.3.20-beta
```

**Dev**
```
docker run --rm --name radiox-dev --net host -e DISCORD_TOKEN= -e DEV_MODE=true -v "$PWD":/usr/src/app/ warengroup/eximiabots-radiox:0.3.20-dev
```


## Join our Discord Server
https://discord.gg/rRA65Mn
