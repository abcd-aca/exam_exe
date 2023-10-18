import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import {appReducer} from './modules/app';
// const reducers = import.meta.glob("./modules/*.ts");
// console.log(reducers)
const store = configureStore({
    reducer:{
        appReducer
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false,
        })
    
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;