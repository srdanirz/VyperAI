import { createStore } from "@reduxjs/toolkit";
import appReducer from "./features/appSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
