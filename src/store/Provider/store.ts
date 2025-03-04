import {
  type Action,
  configureStore,
  type ThunkAction,
} from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storeConfig from "./config";
import rootReducer from "./rootReducer";

export const persistedReducer = persistReducer(
  storeConfig.reduxPersistConfig as any,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(storeConfig.defaultMiddlewareOptions),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
