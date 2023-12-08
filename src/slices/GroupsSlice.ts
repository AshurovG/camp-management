import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RecGroupsData, UserData } from "../../types";

interface DataState {
  groups: RecGroupsData[],
  users: UserData[],
  allMembers: UserData[],
  allSubgroups: RecGroupsData[],
  filteredUsers: UserData[],
  filteredGroups: RecGroupsData[],
  // addedMembers: number[],
  // addedSubgroups: number[]
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    groups: [],
    users: [],
    allMembers: [],
    allSubgroups: [],
    filteredUsers: [],
    filteredGroups: []
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

    setAllMembers(state, action: PayloadAction<UserData[]>) {
      state.allMembers = action.payload;
    },

    setAllSubgroups(state, action: PayloadAction<RecGroupsData[]>) {
      state.allSubgroups = action.payload;
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

export const useAllMembers = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.allMembers);

export const useAllSubgroups = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.allSubgroups);

export const useFilteredUsers = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.filteredUsers);

export const useFilteredGroups = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.filteredGroups);

export const {
    setGroups: setGroupsAction,
    setUsers: setUsersAction,
    setAllMembers: setAllMembersAction,
    setAllSubgroups: setAllSubgroupsAction,
    setFilteredUsers: setFilteredUsersAction,
    setFilteredGroups: setFilteredGroupsAction,
} = dataSlice.actions;

export default dataSlice.reducer;