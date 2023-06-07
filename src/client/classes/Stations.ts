import logger from "../funcs/logger";

export interface station {
    name: string,
    owner: string,
    logo: string,
    stream: {
        [key: string]: string
    }
}

export default class Stations extends Array {

    constructor() {
        super();
    }

    async fetch(options: { url: string, show?: boolean}){
        try {
            logger('Stations', 'Started fetching list - ' + options.url);
            let stations: station[] = await fetch(options.url)
                .then(this.checkFetchStatus)
                .then((response: Response) => response.json());

            for (const station of stations){
                this.push(station);
                if(options.show) logger('Stations', station.name);
            }

            logger('Stations', 'Successfully fetched list');
        } catch (error) {
            logger('Stations', 'Fetching list failed');
            console.error(error + "\n");

            if(this.length == 0) setTimeout( () => {
                this.fetch(options)
            }, 150 );
        }
    }

    checkFetchStatus(response: Response) {
        if (response.ok) {
            return response;
        } else {
            throw new Error(response.status + " " + response.statusText);
        }
    }

    search(key: string, type: string) {
        if (this === null || !key || !type) return null;

        if(type == "direct"){
            let foundStation;
            for(const station of this){
                if(station.name != key) return null;
                foundStation = station;
            }

            return foundStation;
        } else {

            let foundStations : { station: string, name: string, probability: number }[] = [];
            if (key == "radio") return null;

            this
                .filter(
                    x => x.name.toUpperCase().includes(key.toUpperCase()) || x === key
                )
                .forEach(x =>
                    foundStations.push({ station: x, name: x.name, probability: 100 })
                );

            if (key.startsWith("radio ")) key = key.slice(6);
            const probabilityIncrement = 100 / key.split(" ").length / 2;
            for (let i = 0; i < key.split(" ").length; i++) {
                this
                    .filter(
                        x => x.name.toUpperCase().includes(key.split(" ")[i].toUpperCase()) || x === key
                    )
                    .forEach(x =>
                        foundStations.push({ station: x, name: x.name, probability: probabilityIncrement })
                    );
            }
            if (foundStations.length === 0) return null;
            for (let i = 0; i < foundStations.length; i++) {
                for (let j = 0; j < foundStations.length; j++) {
                    if (foundStations[i] === foundStations[j] && i !== j) foundStations.splice(i, 1);
                }
            }
            for (let i = 0; i < foundStations.length; i++) {
                if (foundStations[i].name.length > key.length) {
                    foundStations[i].probability -=
                        (foundStations[i].name.split(" ").length - key.split(" ").length) *
                        (probabilityIncrement * 0.5);
                } else if (foundStations[i].name.length === key.length) {
                    foundStations[i].probability += probabilityIncrement * 0.9;
                }

                for (let j = 0; j < key.split(" ").length; j++) {
                    if (!foundStations[i].name.toUpperCase().includes(key.toUpperCase().split(" ")[j])) {
                        foundStations[i].probability -= probabilityIncrement * 0.5;
                    }
                }
            }
            let highestProbabilityStation : { station: string, name: string, probability: number } | undefined;
            let stationName = "";

            for (let i = 0; i < foundStations.length; i++) {
                if (
                    !highestProbabilityStation ||
                    highestProbabilityStation.probability < foundStations[i].probability
                )
                    highestProbabilityStation = foundStations[i];
                if (
                    highestProbabilityStation &&
                    highestProbabilityStation.probability === foundStations[i].probability
                ) {
                    stationName = foundStations[i].station;
                }
            }
            return stationName;
        }
    }
};
