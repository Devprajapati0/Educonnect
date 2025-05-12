import { createSlice } from "@reduxjs/toolkit";

// Initial state for the auth slice
const initialState = {
  user: {
    _id: "",
    username: "",
    role:"",
    email:"",
    avatar:"",
    token:"",
    publicKey:"",
  },
  isAuthenticated: false,
  isFileOpen:false,
  
};
export const authSlice = createSlice({
  name: "use",
  initialState: initialState,
  reducers: {
   login: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setFileOpen: (state, action) => {
      state.isFileOpen = action.payload;
    },

  },
});
export const {login,logout,setFileOpen} = authSlice.actions;

export default authSlice.reducer;