import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./middlewareBaseQuery";

export const gameManagementApi = createApi({
  reducerPath: "gameManagementApi",
  baseQuery: baseQueryWithAuth,

  endpoints: (builder) => ({
    getGameList: builder.query({
      query: (user) =>
        `/admin/get-game-list?page=${user?.page}&limit=${user?.limit}&sortBy=${user?.sortBy}&sortOrder=${user?.sortOrder}&search=${user?.search}`,
    }),

    postAddGame: builder.mutation({
      query: (body) => ({
        url: "/admin/add-game",
        method: "POST",
        body,
      }),
    }),
    postUpdateGame: builder.mutation({
      query: (body) => ({
        url: "/admin/update-game",
        method: "PATCH",
        body,
      }),
    }),

    getSingleGameList: builder.query({
      query: (id) =>
        `/admin/get-single-game-list?id=${id}`,
    }),
    
  }),
});

export const {  useLazyGetGameListQuery, usePostAddGameMutation, usePostUpdateGameMutation , useLazyGetSingleGameListQuery } =
  gameManagementApi;
