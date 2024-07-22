# RadioX by EximiaBots
Internet Radio to your Discord guild

## [Radio Stations List](https://eximiabots.waren.io/radiox/stations.json)
This bot is getting radio stations from our servers.

https://eximiabots.waren.io/radiox/stations.json

List is generated with cwchristerw's [radio](https://git.waren.io/cwchristerw/radio) repo. This list is currently maintained by Christer Warén. You can use alternative list with same format when using RADIOX_STATIONSLISTURL environment variable.

## Docker

### 1. Build Image

**Production**
```
podman build -t warengroup/eximiabots-radiox:latest . --pull
```

**Beta**
```
podman build -t warengroup/eximiabots-radiox:latest-beta . --pull
```

**Dev**
```
podman build -t warengroup/eximiabots-radiox:latest-dev . --pull
```

### 2. Run Container

**Production**
```
podman run --name radiox -d -e DISCORD_TOKEN= -e STREAMER_MODE=auto -v "$PWD/datastore":/usr/src/app/datastore/ warengroup/eximiabots-radiox:latest
```

**Beta**
```
podman run --name radiox -d -e DISCORD_TOKEN= -e STREAMER_MODE=auto -v "$PWD/datastore":/usr/src/app/datastore/ warengroup/eximiabots-radiox:latest-beta
```

**Dev**
```
podman run --rm --name radiox-dev -e DISCORD_TOKEN= -e DEV_MODE=true -v "$PWD":/usr/src/app/ warengroup/eximiabots-radiox:latest-dev
```

## Join our Discord Server
https://discord.gg/rRA65Mn
