import { combineReducers, configureStore } from "@reduxjs/toolkit"
import buildingDataReducer from "slices/BuildingsSlice"
import groupsDataReducer from 'slices/GroupsSlice'



export default configureStore({
    reducer: combineReducers({
        buildingsData: buildingDataReducer,
        groupsData: groupsDataReducer,
    })
})