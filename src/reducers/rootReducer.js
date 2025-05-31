import { combineReducers } from "@reduxjs/toolkit";
import themeTogglereducer from "../slices/themeToggleSlice"
import formdataReducer from "../slices/FormDataSlice"
const rootReducer=combineReducers({
    themeToggle:themeTogglereducer,
    formData:formdataReducer
})

export default rootReducer