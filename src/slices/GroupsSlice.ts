import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RecGroupsData, UserData, DetailedGroupData } from "../../types";

interface DataState {
  groups: RecGroupsData[],
  users: UserData[],
  filteredUsers: UserData[],
  filteredGroups: RecGroupsData[],
  detailedGroup: DetailedGroupData
  // addedMembers: number[],
  // addedSubgroups: number[]
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    groups: [],
    users: [],
    filteredUsers: [],
    filteredGroups: [],
    detailedGroup: {
      members: [],
      allMembers: [],
      childrenGroups: [],
      allChildrenGroups: []
    },
    // addedMembers: [],
    // addedSubgroups: []
  } as DataState,
  reducers: {
    setGroups(state, action: PayloadAction<RecGroupsData[]>) {
      state.groups = action.payload;
    },

    setUsers(state, action: PayloadAction<UserData[]>) {
      state.users = action.payload;
    },

    setDetailedGroup(state, action: PayloadAction<DetailedGroupData>) {
      state.detailedGroup = action.payload;
    },

    setFilteredUsers(state, action: PayloadAction<UserData[]>) {
      state.filteredUsers = action.payload;
    },

    setFilteredGroups(state, action: PayloadAction<RecGroupsData[]>) {
      state.filteredGroups = action.payload;
    },

    // setAddedMembers(state, action: PayloadAction<number[]>) {
    //   state.addedMembers = action.payload;
    // },

    // setAddedSubgroups(state, action: PayloadAction<number[]>) {
    //   state.addedSubgroups = action.payload;
    // },
  },
});

export const useGroups = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.groups);

export const useUsers = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.users);

export const useFilteredUsers = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.filteredUsers);

export const useFilteredGroups = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.filteredGroups);

export const useDetailedGroup = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.detailedGroup);



export const {
    setGroups: setGroupsAction,
    setUsers: setUsersAction,
    setDetailedGroup: setDetailedGroupAction,
    setFilteredUsers: setFilteredUsersAction,
    setFilteredGroups: setFilteredGroupsAction,
} = dataSlice.actions;

export default dataSlice.reducer;