import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import instituteReducer from "./slice/instituteSlice";
import api from "./api/api";
const persistConfig = {
  key: "institute",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, instituteReducer);
// import api from "./api/api";
 const store = configureStore({
  reducer: {
    institute: persistedAuthReducer,
    [ api.reducerPath]: api.reducer,


  },
   middleware: (defaultmiddleware)=>[...defaultmiddleware(),api.middleware],
})
export const persistor = persistStore(store);
export default store;