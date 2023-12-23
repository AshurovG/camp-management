import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { CommonData, UserInfoData  } from "../../types";

interface DataState {
  common: CommonData | null;
  userInfo: UserInfoData | null;
  isUserInfoLoading: boolean;
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    common: null,
    userInfo: null,
    isUserInfoLoading: true,
    authChecking: true
  } as DataState,
  reducers: {
    setCommon(state, action: PayloadAction<CommonData>) {
      state.common = action.payload;
    },
    setUserInfo(state, action: PayloadAction<UserInfoData | null>) {
      state.userInfo = action.payload;
    },
    setUserInfoNull(state, action) {
      state.userInfo = null;
    },
    setIsUserInfoLoading(state, action: PayloadAction<boolean>) {
      state.isUserInfoLoading = action.payload;
    },
  },
});

export const useCommon = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.common);

export const useUserInfo = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.userInfo);

export const useIsUserInfoLoading = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.isUserInfoLoading);

export const {
  setCommon: setCommonAction,
  setUserInfo: setUserInfoAction,
  setUserInfoNull: setUserInfoNullAction,
  setIsUserInfoLoading: setIsUserInfoLoadingAction
} = dataSlice.actions;

export default dataSlice.reducer;