import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    institute:{
        fullname: "",
        email: "",
        type: "",
        subdomain: "",
        _id: "",
    },
    isActive: false,
}

const instituteSlice = createSlice({
    name: "institute",
    initialState,
    reducers: {
        setInstitute: (state, action) => {
            state.institute = action.payload;
        },
        setIsActive: (state, action) => {
            state.isActive = action.payload;
        },
        removeInstitute: (state) => {
            state.institute = initialState.institute;
            state.isActive = false;
        },
        
    },
});

export const {setInstitute,setIsActive,removeInstitute} = instituteSlice.actions;
export default instituteSlice.reducer;