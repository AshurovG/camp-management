import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { EventsData } from "../../types";

interface DataState {
  currentEvent: EventsData | null
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    currentEvent: null
  } as DataState,
  reducers: {
    setCurrentEvent(state, action: PayloadAction<EventsData>) {
      state.currentEvent = action.payload;
      console.log(action.payload)
    },
  },
});

export const useCurrentEvent = () =>
  useSelector((state: { eventsData: DataState }) => state.eventsData.currentEvent);

export const {
  setCurrentEvent: setCurrentEventAction
} = dataSlice.actions;

export default dataSlice.reducer;