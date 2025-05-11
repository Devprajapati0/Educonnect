import { createSlice } from "@reduxjs/toolkit";

// Initial state for the auth slice
const initialState = {
    notificationCount : 0,
    newMessageAlert :[],
    avatar:{
      image: null,
      chatId:"",
      name:"",
      _id:"",
      isGroup:false,
    }
};
export const chatSlice = createSlice({
  name: "use",
  initialState: initialState,
  reducers: {
   incrementNotification: (state) => {
      state.notificationCount += 1;
    }
    ,
    decrementNotification: (state) => {
      state.notificationCount -= 1;
    },
    resetNotification: (state) => {
      state.notificationCount = 0;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    },
    setNewMessageAlert: (state, action) => {
      if (!Array.isArray(state.newMessageAlert)) {
        state.newMessageAlert = [];
      }
    
      const { chatId } = action.payload;
      const chat = state.newMessageAlert.find(chat => chat.chatId === chatId);
    
      if (chat) {
        chat.count += 1;
      } else {
        state.newMessageAlert.push({ chatId, count: 1 });
      }
    },
    removeNewMessageAlert: (state, action) => {
      const { chatId } = action.payload;
      state.newMessageAlert = state.newMessageAlert.filter((chat) => chat.chatId !== chatId);
    },  

  },
});
export const {removeNewMessageAlert,incrementNotification,decrementNotification,resetNotification,setNewMessageAlert,setAvatar} = chatSlice.actions;

export default chatSlice.reducer;