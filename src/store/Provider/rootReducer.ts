import { persistReducer } from "redux-persist";
import { commonPersistConfig } from "./config";
import CommonSlice from "@/store/reducers/common/slice";
import { combineReducers } from "@reduxjs/toolkit";

export const commonReducer = persistReducer(
  commonPersistConfig,
  CommonSlice.reducer
);

const rootReducer = combineReducers({
  [CommonSlice.name]: commonReducer,
});

export default rootReducer;
