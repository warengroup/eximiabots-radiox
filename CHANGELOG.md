# CHANGELOG

## 0.5.8 (30.9.2024)

Patch Release

**Package**
- Dependencies Update

**Documentation**
- Update radio stations list address and repo in README.md
- Fix versions 0.5.5-0.5.7 release years in CHANGELOG.md

**Contributors:**
[cwchristerw](<https://github.com/cwchristerw>)

## 0.5.7 (19.6.2024)

Patch Release

**Package**
- Dependencies Update

**Contributors:**
[cwchristerw](<https://github.com/cwchristerw>)

## 0.5.6 (8.6.2024)

Patch Release

**Package**
- Dependencies Update

**Documentation**
- Add CHANGELOG.md

**Contributors:**
[cwchristerw](<https://github.com/cwchristerw>)

## 0.5.5 (30.4.2024)

Patch Release

- Avoid refreshing player too often to keep in Discord API quotas.

**Package**
- Dependencies Update

**Miscellaneous:**
- Dockerfile: Use "docker.io/library/node:20-alpine" as upstream to image.

**Documentation**
- Use Podman in instructions.

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.5.4 (21.12.2023)

Patch Release

- Update new stationlistUrl address
- Change player interval to every 10 seconds in Play function
- Handle application commands better in commands.ts
- Handle DiscordAPIError: unknown interaction in uncaughtException event
- Remove audioPlayer maxMissedFrames in Streamer class
- Remove Bug command
- Remove Invite command

**Package**
- Dependencies Update

**Miscellaneous:**
- Dockerfile
- Github Workflow: Labeler (update)

**Docs**
- .env_example Update

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.5.3 (29.11.2023)

Patch Release

- Add duration to Play command
- Add RadioPlay playlist support to track info
- Remove Now Playing command

**Package**
- Dependencies Update
- Typescript Typings

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.5.2 (23.11.2023)

Patch Release

- Display track info in play and nowplaying commands
- Fix idling audioPlayer

**Package**
- Update Dependencies
- Typescript Typings

**Docs**
- Update supported versions list in SECURITY.md

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.5.1 (13.7.2023)

Patch Release

**Package**
- Update Dependencies

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.5.0 (9.6.2023)

Minor Release

- Create event listeners once in Streamer class.
- Limit commands in maintenance mode.
- Remove unnecessary await in Play command.
- Replace multiple forEach loop to for...of loops.
- Move events and funcs from RadioClient to events.ts and funcs.ts respectively.
- Remove execute functions in events and commands.ts.
- Move emojis into messages.ts.
- Fallback missing version into version 0.0.0.
- Change em dash to dash in Stations class.
- Remove messageCreate event and deprecation messages.
- Converted codebase to Typescript

**Package**
- NodeJS 18
- Use lockfileVersion 3
- Remove node-fetch dependency
- Update Dependencies

**Documentation**
- Removed version 0.4.x support in Security Policy

**Miscellaneous:**
- Dockerfile

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.4.3 (4.6.2023)

Patch Release

**Package**
- Update Dependencies

***Miscellaneous:***
- Github Workflow: Docker Build & TypeScript Build (update)

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.4.2 (24.5.2023)

Patch Release

- Fix Status command
- Replaced SelectMenuBuilder (deprecated) with StringSelectMenuBuilder (Discord.js)

**Package**
- Update Dependencies

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.4.1 (29.11.2022)

Patch Release

**Package**
- Update Dependencies

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.4.0 (19.7.2022)

Minor Release

**Package**
- Update Dependencies

**Docs**
- Improviding Docker instructions in README.md

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.20 (7.4.2022)

Patch Release

- Added dashboard link to Statistics command. Preparations to [#24](<https://github.com/warengroup/eximiabots-radiox/issues/24>)
- Minor changes in Ready event and Stations class.
- Fixed multiple bugs [#286](<https://github.com/warengroup/eximiabots-radiox/issues/286>), [#284](<https://github.com/warengroup/eximiabots-radiox/issues/284>), [#283](<https://github.com/warengroup/eximiabots-radiox/issues/283>), [#227](<https://github.com/warengroup/eximiabots-radiox/issues/227>).

**Package**
- Update Dependencies

***Miscellaneous:***
- Github Workflow: Dependabot Auto-Merge (update)

**Docs**
- Improviding Docker instructions in README.md

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.19 (26.2.2022)

Patch Release

**Package**
- Update Dependencies

***Miscellaneous:***
- Github Workflow: Docker Build & TypeScript Build (update)

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.18 (26.2.2022)

Patch Release

***Miscellaneous:***
- Github Workflow: Dependabot Auto-Merge (update)

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.17 (26.2.2022)

Patch Release

**Package**
- Update Dependencies

***Miscellaneous:***
- Github Workflow: Dependabot Auto-Merge (update)

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.16 (24.2.2022)

Patch Release

**Package**
- Update Dependencies

***Miscellaneous:***
- Github Workflow: Dependabot Auto-Merge (update)

**Docs**
- Update year in LICENSE

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.15 (21.2.2022)

Patch Release

**Package**
- Updated Dependencies

***Miscellaneous:***
- Github Workflow: CodeQL Analyze (update)
- Github Workflow: Dependabot Auto-Merge (new)

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.14 (1.2.2022)

Patch Release

**Package**
- Updated Dependencies

***Miscellaneous:***
- Github Workflow: Typescript Build (updated)

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.13 (21.12.2021)

Patch Release

- Listen function will use play to restart playing station when streamerMode is manual and audioPlayer has no subscribers in Streamer class
- Prevent bot restarting when uncaughtException event is caused by "DiscordAPIError - Unknown interaction" in uncaughtException event.
- Remove Discord.js voice audioResource event listeners in Streamer class

**Package**
- Updated Dependencies

***Miscellaneous:***
- Github Workflow: Typescript Build (updated)

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.12 (30.11.2021)

Patch Release

- Add removal feature when station isn't working in Stations class
- Add direct type to search function in Stations class
- Add validation to station at restore function in Radio class
- Add manual mode at play function in Streamer class
- Update audioPlayer idle event in Streamer class
- Update fetch function in Stations class
- Change stationsListURL
- Move previous search function to text type at search function in Stations class

**Package**
- Updated Dependencies

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.11 (18.9.2021)

Patch Release

- Catch errors inside loadEntry method in Datastore class
- Fix memory leak bug in Streamer class
- Dont delete first streamer when refreshing streamers in Streamer class
- Fix maintenance command

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.10 (17.9.2021)

Patch Release

- Fix Stations class bug
- Prevent loadState function updating datastore entries everytime
- Streamlined restore method in Radio class with play command

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.9 (17.9.2021)

Patch Release

- Move Datastore class into classes folder.
- Add loadEntry method to Datastore class.
- Move calculateGlobal method from Datastore to Statistics class.
- Create Radio, Stations, Streamer, Statistics class.
- Commands are now set into map in commands.js.
- Remove application command options in maintenance command.
- Add Streamer Mode – Manual and Streamer Mode – Auto to selectMenu in maintenance command.
- Small fixes to next, play and prev command.
- Hide owner when its same as station name in nowplaying command.
- Update fields in status command.
- Delete message when using stop command in different textChannel.
- Small fixes to SIGINT, interactionCreate and ready event.
- Delete radio when no members in voiceChannel with excluding bot users in voiceStateUpdate event.
- Small fixes to check, isDev, listStations and logger function.
- Move checkFetchStatus function to Stations class.
- Delete message and send new message when textChannel has changed in play function.
- Hide owner when its same as station name in play function.
- Move restoreRadios function to Radio class.
- Move saveRadios function to Radio class.
- Move searchStation function to Statistics class.
- Move statisticsUpdate function to Statistics class.
- Update statusFields in messages.
- Rename maintenanceMode in config.
- Add Streamer Mode in config.
- Add Dev Mode in config.

**Package**
- Updated Dependencies

**Docs**
- Add new environment variables to .env_example file.

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.8 (10.9.2021)

Patch Release

- Add maintenance mode
- Node-fetch update to 3.0.0 with temporary solution
- Create exit event in Client.ts and added logger.
- Remove logger from SIGINT event
- Handle warnings in event instead of default warnings.
- Add logger to uncaughtException event
- Update login error catcher

**Package**
- Updated Dependencies

***Miscellaneous:***
- VSCode settings

**Docs**
- Contributing Guide – CONTRIBUTING.md (new)
- Security Policy – SECURITY.md (new)

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.7 (7.9.2021)

Patch Release

- Fixed messageCreate event

**Package**
- Updated Dependencies

***Miscellaneous:***
- Github Workflow: Labeler (updated)

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.6 (6.9.2021)

Patch Release

- Fixed prev & next command
- Changed forgotten interaction replies to ephemeral in commands.
- Handle uncaughtException event
- Tidied code

**Package**
- Updated Dependencies

***Miscellaneous:***
- Github Workflow: CodeQL Analyze (new), Labeler (new)

**Docs**
- Updated README.md

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.5 (6.9.2021)

Patch Release

- Avoid answering interaction that came from channels that bot has no rights to view.
- Hide decimals from global percent in statistics
- Check if there members when restoring radio instead of returning to empty channel and staying alone.
- Simplified listStations function and decided to hide one channel because it has maximum of 25 items in select menu options.
- Show unknown errors more transparently by using console.error function when needed.
- Moved restoreRadios function to funcs folder
- Created saveRadios function
- Updated SIGINT event: Removed code that was there before saveRadios function was separated into function script
- Added more controls to maintenance command
- Fixed play command

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>) & [Vekki000](<https://github.com/Vekki000>)

## 0.3.4 (5.9.2021)

Patch Release

- Created next & prev command
- Fixed typo in bug command code
- Added loggers to Slash Commands creation process
- Tidied code and moved few functions to funcs folder
- Disabled removing commands when bot is going offline
- Removed deprecated code that may have caused bot to restart unintentionally

**Package**
- Updated Dependencies

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.3 (4.9.2021)

Patch Release

- Changed few replies to ephemeral in nowplaying command.
- Fixed bug command

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.2 (3.9.2021)

Patch Release

- Added station logo to embed thumbnail
- Added empty image to make embeds same size
- Improved mobile user experience by removing unnecessary spaces in messages
- restoreradio.js is now checking that there is stations before continuing.
- Improved Dev bot to remove slash commands during process ending.

***Package:***
- Updated Dependencies

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.1 (3.9.2021)

Patch Release

- Added message command deprecation message
- Updated Invite link
- Added messageDelete event
- Edited play message
- Updated logger
- Updated list command
- Gracefully handling process ending when requested (SIGINT & SIGTERM)
- Update startTime when changing stations
- Remove play message when bot is disconnected from voice channel
- Removed references to prefix
- Removed unnecessary comments & messages
- Removed maintenance message in maintenance command because we will automatically resume playing after restart by saving and loading state.

***Package:***
- Updated Dependencies

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.3.0 (31.8.2021)

Minor Release

- Slash Commands
- Removed Message Commands
- Improved logging with new logger function
- Yle X is now searchable
- Ephemeral replies
- New invite link
- Using play command now gives you dropdown menu when no station id or name is given to command.
- Elapsed time is better shown because bot has improved msToTime function.
- New Emojis
- We may utilize new Discord features because bot can now handle new types of interactions.
- Version number in console

***Package:***
- Updated Dependencies

***Miscellaneous:***
- Dockerfile
- Github Workflow: TypeScript Build

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.2.4 (31.8.2021)

Patch Release

Changed voiceAdapterCreator to Discord.js instead of custom adapter. Should fix #26 indefinitely until major changes coming to Discord.js or Discord.js Voice.

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.2.3 (21.8.2021)

Patch Release

- Fixed help command (#28)
- Nulling connection after bot is disconnected

***Package:***
- Updated Dependencies

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.2.2 (21.8.2021)

Patch Release

Fixed #26 in voiceStateUpdate.js

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.2.1 (18.8.2021)

Patch Release

***Package:***
- Updated Dependencies

***Miscellaneous:***
- Dockerfile
- Github Workflow: Docker Build (new)

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>)

## 0.2.0 (8.8.2021)

Minor Release

***Miscellaneous:***
- eslint
- prettier
- Dockerfile
- TypeScript

__**Contributors:**__
[cwchristerw](<https://github.com/cwchristerw>) & [MatteZ02](<https://github.com/MatteZ02>)

## 0.1.0 (15.6.2021)
\-
