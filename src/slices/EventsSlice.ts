import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { EventsData } from "../../types";

interface DataState {
  events: EventsData[],
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    events: []
  } as DataState,
  reducers: {
    setEvents(state, action: PayloadAction<EventsData[]>) {
      state.events = action.payload;
      console.log(action.payload)
    },
  },
});

export const useEvents = () =>
  useSelector((state: { eventsData: DataState }) => state.eventsData.events);

export const {
  setEvents: setEventsAction,
} = dataSlice.actions;

export default dataSlice.reducer;