import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";


const store = configureStore({
    reducer: {
        // your reducers here
    },
    middleware: ()=>[]
})

export const presistor = persistStore(store);
export  {store};