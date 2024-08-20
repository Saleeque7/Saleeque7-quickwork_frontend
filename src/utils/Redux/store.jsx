import { configureStore ,combineReducers  } from '@reduxjs/toolkit'
import userAuth from './userSlice'
import clientAuth from './recruiterSlice'
import adminAuth from './adminSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'; 

const persistConfig = {
    key:'root',
    version:1,
    storage
}

const reducer = combineReducers({
    user:userAuth,
    client:clientAuth,
    admin:adminAuth
})

const persistedReducer = persistReducer(persistConfig,reducer)

export const store = configureStore({
reducer:{
    persisted:persistedReducer,
},
middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
        serializableCheck: false,
    }),
    devTools: process.env.NODE_ENV !== 'production',
})


export const persistor = persistStore(store);

 