import { createSlice } from "@reduxjs/toolkit";

const publicKeySlice = createSlice({
    name:'publicKey',
    initialState: {},
    reducers:{
        setPublicKey(state, action) {
            const { _id, publicKey } = action.payload;
            let userId = _id;
            state[userId] = publicKey;
        },
    }
})

export const { setPublicKey } = publicKeySlice.actions;
export default publicKeySlice.reducer;

