import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import instituteReducer from "./slice/instituteSlice";
import chatReducer from "./slice/chatSlice";
import authReducer from "./slice/authSlice";
import api from "./api/api";
const persistConfig = {
  key: "institute",
  storage,
};

const persistedInstituteReducer = persistReducer(persistConfig, instituteReducer);
const persistedChatReducer = persistReducer(persistConfig, chatReducer);
 const persistedAuthReducer = persistReducer(persistConfig, authReducer);
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