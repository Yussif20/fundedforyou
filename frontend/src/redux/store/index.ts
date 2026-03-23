import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import authReducer from "../authSlice";
import gmtReducer from "../gmtSlice";
import { baseApi } from "../api/baseApi";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const authPersistConfig = {
  key: "auth",
  storage: storage,
};
const gmtPersistConfig = {
  key: "funded-for-you-gmt",
  storage: storage,
};

const persistedReducer = persistReducer(authPersistConfig, authReducer);
const gmtPersistedReducer = persistReducer(gmtPersistConfig, gmtReducer);

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: persistedReducer,
  gmt: gmtPersistedReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);

// Export states and hooks
export const getCurrentState = () => store.getState();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const persistor = persistStore(store);
