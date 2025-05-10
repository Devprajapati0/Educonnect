import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import instituteReducer from "./slice/instituteSlice";
import chatReducer from "./slice/chatSlice";
import authReducer from "./slice/authSlice";
import api from "./api/api";
const persistConfigInstitute = {
  key: "institute",
  storage,
};
const persistConfigChat = {
  key: "chat",
  storage,
};
const persistConfigAuth = {
  key: "auth",
  storage,
};

const persistedInstituteReducer = persistReducer(persistConfigInstitute, instituteReducer);
const persistedChatReducer = persistReducer(persistConfigChat, chatReducer);
 const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);
// import api from "./api/api";
 const store = configureStore({
  reducer: {
    institute: persistedInstituteReducer,
    chat: persistedChatReducer,
    auth: persistedAuthReducer,
    
    [ api.reducerPath]: api.reducer,


  },
   middleware: (defaultmiddleware)=>[...defaultmiddleware(),api.middleware],
})
export const persistor = persistStore(store);
export default store;