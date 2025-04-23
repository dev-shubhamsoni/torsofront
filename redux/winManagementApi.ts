import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./middlewareBaseQuery";

export const winManagementApi = createApi({
  reducerPath: "winManagementApi",
  baseQuery: baseQueryWithAuth,

  endpoints: (builder) => ({
    getWinList: builder.query({
      query: (user) =>
        `/admin/get-win-list?page=${user?.page}&limit=${user?.limit}&sortBy=${user?.sortBy}&sortOrder=${user?.sortOrder}&search=${user?.search}`,
    }),
    
    postWinData: builder.mutation({
      query: (body) => ({
        url: "/admin/add-win-data",
        method: "POST",
        body,
      }),
    }),
    postDeclareWinners: builder.mutation({
      query: (body) => ({
        url: "/admin/post-declare-winners",
        method: "POST",
        body,
      }),
    }),
    
    getWinnersList: builder.query({
      query: (user) =>
        `/admin/get-winners-list?page=${user?.page}&limit=${user?.limit}&sortBy=${user?.sortBy}&sortOrder=${user?.sortOrder}&search=${user?.search}&marketId=${user.marketId}&gameId=${user.gameId}&bid_type=${user.bid_type}&win_number=${user.win_number}&resultDate=${user.resultDate}`,
    }),

    deleteWinData: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-win-data?win_id=${id}`, 
        method: "DELETE",
      }),
    }),
    
    
  
  }),
});

export const {  useLazyGetWinListQuery, usePostWinDataMutation, useLazyGetWinnersListQuery, useDeleteWinDataMutation, usePostDeclareWinnersMutation } =
  winManagementApi;
