export type EventData = {
    id: number;
    title: string;
    timeStart: string;
    timeEnd: string;
    place: string;
}

export type DayData = {
    id: number;
    title: string;
    weekDay: string;
    events: EventData[]
}

export type BuildingDetailedData = {
    id: number;
    name: string;
    rooms: RecRoomData[];
    publicPlaces: RecPublicPlacesData[];
}


// API types

export type RecBuildingData = {
    id: number;
    name: string;
}

export type RecRoomData = {
    id: number;
    number: number;
    capacity: number;
}

export type RecPublicPlacesData = {
    id: number;
    name: string;
}

export type RecBuildingDetailedData = {
    id: number;
    name: string;
    rooms: RecRoomData[];
    public_places: RecPublicPlacesData[];
}