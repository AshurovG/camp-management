import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { EventsData, RecGroupsData, UserData } from "../../types";

interface DataState {
  currentEvent: EventsData | null;
  isEventsChanged: boolean;
  usersFromEvent: UserData[]
  groupsFromEvent: RecGroupsData[]
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    usersFromEvent: [],
    groupsFromEvent: [],
    currentEvent: null,
    isEventsChanged: false,
  } as DataState,
  reducers: {
    setCurrentEvent(state, action: PayloadAction<EventsData>) {
      state.currentEvent = action.payload;
    },
    setIsEventsChanged(state, action: PayloadAction<boolean>) {
        state.isEventsChanged = action.payload;
    },

    setUsersFromEvent(state, action: PayloadAction<UserData[]>) {
        state.usersFromEvent = action.payload;
    },

    setGroupsFromEvent(state, action: PayloadAction<RecGroupsData[]>) {
        state.groupsFromEvent = action.payload;
    },
  },
});

export const useCurrentEvent = () =>
  useSelector((state: { eventsData: DataState }) => state.eventsData.currentEvent);

export const useIsEventsChanged = () =>
  useSelector((state: { eventsData: DataState }) => state.eventsData.isEventsChanged);

export const useUsersFromEvent = () =>
  useSelector((state: { eventsData: DataState }) => state.eventsData.usersFromEvent);

export const useGroupsFromEvent = () =>
  useSelector((state: { eventsData: DataState }) => state.eventsData.groupsFromEvent);

export const {
    setCurrentEvent: setCurrentEventAction,
    setIsEventsChanged: setIsEventsChangedAction,
    setUsersFromEvent: setUsersFromEventAction,
    setGroupsFromEvent: setGroupsFromEventAction

} = dataSlice.actions;

export default dataSlice.reducer;