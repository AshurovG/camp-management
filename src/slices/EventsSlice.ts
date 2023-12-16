import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { EventsData } from "../../types";

interface DataState {
  currentEvent: EventsData | null;
  isEventsChanged: boolean;
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    currentEvent: null,
    isEventsChanged: false
  } as DataState,
  reducers: {
    setCurrentEvent(state, action: PayloadAction<EventsData>) {
      state.currentEvent = action.payload;
    },
    setIsEventsChanged(state, action: PayloadAction<boolean>) {
        state.isEventsChanged = action.payload;
    },
  },
});

export const useCurrentEvent = () =>
  useSelector((state: { eventsData: DataState }) => state.eventsData.currentEvent);

export const useIsEventsChanged = () =>
  useSelector((state: { eventsData: DataState }) => state.eventsData.isEventsChanged);

export const {
  setCurrentEvent: setCurrentEventAction,
  setIsEventsChanged: setIsEventsChangedAction
} = dataSlice.actions;

export default dataSlice.reducer;