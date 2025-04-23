import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slice/authSlice";
import { authApi } from "@/redux/authApi";
import { dashboardApi } from "@/redux/dashboardApi";
import { userManagementApi } from "@/redux/userManagementApi";
import { marketManagementApi } from "@/redux/marketManagementApi";
import { gameManagementApi } from "@/redux/gameManagementApi";
import { bidManagementApi } from "@/redux/bidManagementApi";
import { winManagementApi } from "@/redux/winManagementApi";

export const store = () => {
  return configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
      [userManagementApi.reducerPath]: userManagementApi.reducer,
      [marketManagementApi.reducerPath]: marketManagementApi.reducer,
      [gameManagementApi.reducerPath]: gameManagementApi.reducer,
      [bidManagementApi.reducerPath]: bidManagementApi.reducer,
      [winManagementApi.reducerPath]: winManagementApi.reducer,
      auth: authReducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        authApi.middleware,
        dashboardApi.middleware,
        userManagementApi.middleware,
        marketManagementApi.middleware,
        gameManagementApi.middleware,
        bidManagementApi.middleware,
        winManagementApi.middleware,
      ]),
  });
};

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
