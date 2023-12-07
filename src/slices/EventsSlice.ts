import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RecGroupsData } from "../../types";

interface DataState {
  groups: RecGroupsData[],
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    groups: []
  } as DataState,
  reducers: {
    setGroups(state, action: PayloadAction<RecGroupsData[]>) {
      state.groups = action.payload;
      console.log(action.payload)
    },
  },
});

export const useGroups = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.groups);

export const {
    setGroups: setGroupsAction,
} = dataSlice.actions;

export default dataSlice.reducer;