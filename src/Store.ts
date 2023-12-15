import { combineReducers, configureStore } from "@reduxjs/toolkit"
import buildingDataReducer from "slices/BuildingsSlice"
import groupsDataReducer from 'slices/GroupsSlice'
import mainDataReducer from 'slices/MainSlice'



export default configureStore({
    reducer: combineReducers({
        buildingsData: buildingDataReducer,
        groupsData: groupsDataReducer,
        mainData: mainDataReducer
    })
})