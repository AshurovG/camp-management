import { combineReducers, configureStore } from "@reduxjs/toolkit"
import buildingDataReducer from "slices/BuildingsSlice"
import groupsDataReducer from 'slices/GroupsSlice'
import eventsDataReducer from 'slices/EventsSlice'



export default configureStore({
    reducer: combineReducers({
        buildingsData: buildingDataReducer,
        groupsData: groupsDataReducer,
        eventsData: eventsDataReducer
    })
})