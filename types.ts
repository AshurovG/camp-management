export type EventData = {
    id: number;
    title: string;
    timeStart: string;
    timeEnd: string;
    place: string;
}

export type EventsData = {
    id: number,
    title: string,
    startTime: string,
    endTime: string,
    notification: boolean,
    isNeedScreen: boolean,
    isNeedComputer: boolean,
    isNeedWhiteboard: boolean
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

export type RecGroupsData = {
    id: number;
    name: string;
}

export type RecEventsData = {
    id: number,
    title: string,
    start_time: string,
    end_time: string,
    notification: boolean,
    is_need_screen: boolean,
    is_need_computer: boolean,
    is_need_whiteboard: boolean
}