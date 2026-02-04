import { configureStore } from "@reduxjs/toolkit"
import loaderSliceReducer from './loaderSlice'
import userSliceReducer from './userSlice'

const store = configureStore({
    reducer: {
        loaders: loaderSliceReducer,
        users: userSliceReducer
    },
});

export default store;