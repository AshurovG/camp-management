import { combineReducers, configureStore } from "@reduxjs/toolkit"
import buildingDataReducer from "slices/BuildingsSlice"



export default configureStore({
    reducer: combineReducers({
        buildingsData: buildingDataReducer,
    })
})