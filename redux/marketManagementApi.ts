import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./middlewareBaseQuery";

export const marketManagementApi = createApi({
  reducerPath: "marketManagementApi",
  baseQuery: baseQueryWithAuth,

  endpoints: (builder) => ({
    getMarketList: builder.query({
      query: (user) =>
        `/admin/get-market-list?page=${user?.page}&limit=${user?.limit}&sortBy=${user?.sortBy}&sortOrder=${user?.sortOrder}&search=${user?.search}`,
    }),
    getSingleMarketList: builder.query({
      query: (marketId) => `/admin/get-single-market-list?marketId=${marketId}`,
    }),
    getSingleMarketListNames: builder.query({
      query: () => `/admin/get-market-list-names`,
    }),
    getSingleGameListNames: builder.query({
      query: () => `/admin/get-game-list-names`,
    }),

    postAddMarket: builder.mutation({
      query: (body) => ({
        url: "/admin/add-market",
        method: "POST",
        body,
      }),
    }),

    patchUpdateMarket: builder.mutation({
      query: (body) => ({
        url: "/admin/update-market",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useLazyGetMarketListQuery,
  usePostAddMarketMutation,
  useLazyGetSingleMarketListQuery,
  usePatchUpdateMarketMutation,
  useGetSingleMarketListNamesQuery,
  useGetSingleGameListNamesQuery
} = marketManagementApi;
