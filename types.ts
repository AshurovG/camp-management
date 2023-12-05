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