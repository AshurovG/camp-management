import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { CommonData } from "../../types";

interface DataState {
  common: CommonData | null
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    common: null
  } as DataState,
  reducers: {
    setCommon(state, action: PayloadAction<CommonData>) {
      state.common = action.payload;
      console.log(action.payload)
    },
  },
});

export const useCommon = () =>
  useSelector((state: { mainData: DataState }) => state.mainData.common);

export const {
  setCommon: setCommonAction
} = dataSlice.actions;

export default dataSlice.reducer;