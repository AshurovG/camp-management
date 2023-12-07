import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RecBuildingData, BuildingDetailedData } from "../../types";

interface DataState {
  buildings: RecBuildingData[],
  buildingDetailed: BuildingDetailedData | null;
}

const dataSlice = createSlice({
  name: "data",
  initialState: {
    buildings: [],
    buildingDetailed: {
      id: 0,
      name: '',
      rooms: [],
      publicPlaces: []
  }
  } as DataState,
  reducers: {
    setBuildings(state, action: PayloadAction<RecBuildingData[]>) {
      state.buildings = action.payload;
    },

    setBuildingDetailed(state, action: PayloadAction<BuildingDetailedData>) {
      state.buildingDetailed = action.payload;
      console.log(action.payload)
    },
  },
});

export const useBuildings = () =>
  useSelector((state: { buildingsData: DataState }) => state.buildingsData.buildings);

export const useBuildingDetailed = () =>
  useSelector((state: { buildingsData: DataState }) => state.buildingsData.buildingDetailed);

export const {
    setBuildings: setBuildingsAction,
    setBuildingDetailed: setBuildingDetailedAction
} = dataSlice.actions;

export default dataSlice.reducer;