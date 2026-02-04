import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: "users",
    initialState: {
        user: null,
    },
    reducers: {
        setUser : (state, { payload }) => {
            //console.log({ payload })
            state.user = payload;
        },
    }
});
export const { setUser } = userSlice.actions;
export default userSlice.reducer;