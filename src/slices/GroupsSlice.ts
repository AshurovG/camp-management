import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RecGroupsData, UserData, DetailedGroupData } from "../../types";

interface DataState {
  groups: RecGroupsData[],
  users: UserData[],
  filteredUsers: UserData[],
  detailedGroup: DetailedGroupData,
  isUserChanged: boolean,
  usersWithoutRoom: UserData[]
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    groups: [],
    users: [],
    filteredUsers: [],
    detailedGroup: {
      members: [],
      allMembers: [],
      childrenGroups: [],
      allChildrenGroups: []
    },
    isUserChanged: false,
    usersWithoutRoom: []
  } as DataState,
  reducers: {
    setGroups(state, action: PayloadAction<RecGroupsData[]>) {
      state.groups = action.payload;
    },

    setUsers(state, action: PayloadAction<UserData[]>) {
      state.users = action.payload;
    },

    setFilteredUsers(state, action: PayloadAction<UserData[]>) {
      state.filteredUsers = action.payload;
      console.log('set new filtered user', action.payload)
    },

    setDetailedGroup(state, action: PayloadAction<DetailedGroupData>) {
      state.detailedGroup = action.payload;
    },

    setIsUserChanged(state, action: PayloadAction<boolean>) {
      state.isUserChanged = action.payload;
    },

    setUsersWithoutRoom(state, action: PayloadAction<UserData[]>) {
      state.usersWithoutRoom = action.payload;
    },
  },
});

export const useGroups = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.groups);

export const useUsers = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.users);

export const useFilteredUsers = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.users);

export const useDetailedGroup = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.detailedGroup);

export const useIsUserChanged = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.isUserChanged);

export const useUsersWithoutRoom = () =>
  useSelector((state: { groupsData: DataState }) => state.groupsData.usersWithoutRoom);



export const {
    setGroups: setGroupsAction,
    setUsers: setUsersAction,
    setDetailedGroup: setDetailedGroupAction,
    setFilteredUsers: setFilteredUsersAction,
    setIsUserChanged: setIsUserChangedAction,
    setUsersWithoutRoom: setUsersWithoutRoomAction
} = dataSlice.actions;

export default dataSlice.reducer;