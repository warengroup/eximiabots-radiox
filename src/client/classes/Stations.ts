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
    counter: number;

    constructor() {
        super();
        this.counter = 0;
    }

    async fetch(options: { url: string, show?: boolean }){
        try {
            logger('Stations', 'Started fetching list - ' + options.url);
            let stations = await fetch(options.url)
                .then(this.checkFetchStatus)
                .then((response: { json: () => station[]; }) => response.json());

            if(!stations) return;
            for (const station of stations){
                this.push(station.name);
                if(options.show) logger('Stations', station.name);
            }

            this.counter = 0;

            logger('Stations', 'Successfully fetched list');
        } catch (error) {
            logger('Stations', 'Fetching list failed');
            console.error(error + "\n");

            this.counter = this.counter + 1;
            if(this.length == 0 && 5 < this.counter) this.fetch(options);
        }
    }

    checkFetchStatus(response: any) {
        if (response.ok) {
            return response;
        } else {
            throw new Error(response.status + " " + response.statusText);
        }
    }

    search(key: string, type: string) {
        if (this === null) return false;
        if (!key) return false;
        if (!type) return false;

        if(type == "direct"){
            let foundStation;
            this.forEach(station => {
                if(station.name != key) return false;
                foundStation = station;
            });

            return foundStation;
        } else {

            let foundStations : { station: string, name: string, probability: number }[] = [];
            if (key == "radio") return false;

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
            if (foundStations.length === 0) return false;
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
            /*let highestProbabilityStation : { station: string, name: string, probability: number } | string | undefined;
            for (let i = 0; i < foundStations.length; i++) {
                if (
                    !highestProbabilityStation ||
                    //@ts-ignore
                    highestProbabilityStation.probability < foundStations[i].probability
                )
                    highestProbabilityStation = foundStations[i];
                if (
                    highestProbabilityStation &&
                    //@ts-ignore
                    highestProbabilityStation.probability === foundStations[i].probability
                ) {
                    highestProbabilityStation = foundStations[i].station;
                }
            }
            return highestProbabilityStation;*/
        }
    }
};
