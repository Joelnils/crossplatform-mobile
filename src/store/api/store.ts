import authSlice from '../slices/autSlice'; // Make sure this path is correct

import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import { postsApi } from './postsApi';

import { usersApi } from "../api/usersApi";
 
const middlewares = [usersApi.middleware, postsApi.middleware];
 
if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);
 
  middlewares.push(logger);
}
 
const persistConfig = {
  key: "crossplatform-mobile-v1.0.0",
  storage: AsyncStorage,
  whitelist: ["auth"], // Lägg till fler delar av store som du vill spara här.
};
 
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    [usersApi.reducerPath]: usersApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer, 

    auth: authSlice,
  }),
);
 
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
        ],
      },
    }).concat(...middlewares),
});
 
export const persistor = persistStore(store);
 
setupListeners(store.dispatch);