import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RecGroupsData, UserData, DetailedGroupData } from "../../types";

interface DataState {
  groups: RecGroupsData[],
  users: UserData[],
  detailedGroup: DetailedGroupData
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    groups: [],
    users: [],
    detailedGroup: {
      members: [],
      allMembers: [],
      childrenGroups: [],
      allChildrenGroups: []
    },
  } as DataState,
  reducers: {
    setGroups(state, action: PayloadAction<RecGroupsData[]>) {
      state.groups = action.payload;
    },

    setUsers(state, action: PayloadAction<UserData[]>) {
      state.users = action.payload;
      console.log('set new user', action.payload)
    },

    setDetailedGroup(state, action: PayloadAction<DetailedGroupData>) {
      state.detailedGroup = action.payload;
    },
  },
});

export const useGroups = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.groups);

export const useUsers = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.users);

export const useDetailedGroup = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.detailedGroup);



export const {
    setGroups: setGroupsAction,
    setUsers: setUsersAction,
    setDetailedGroup: setDetailedGroupAction,
} = dataSlice.actions;

export default dataSlice.reducer;