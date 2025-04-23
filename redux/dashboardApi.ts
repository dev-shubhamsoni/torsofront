import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./middlewareBaseQuery";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithAuth,

  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => `/admin/get-dashboard-stats`,
    }),
    getUserTransactionList: builder.query({
      query: (txnData) =>
        `/admin/all-transactions-list?page=${txnData?.page}&limit=${txnData?.limit}&sortBy=${txnData?.sortBy}&sortOrder=${txnData?.sortOrder}&search=${txnData?.search}`,
    }),
    getSingleUserTransactionList: builder.query({
      query: (txnData) =>
        `/admin/single-transaction?page=${txnData?.page}&limit=${txnData?.limit}&sortBy=${txnData?.sortBy}&sortOrder=${txnData?.sortOrder}&search=${txnData?.search}&uid=${txnData?.uid}`,
    }),
    getSIngleUser: builder.query({
      query: (uid) => `admin/single-user?uid=${uid}`,
    }),
  }),
});

export const { useGetDashboardStatsQuery, useLazyGetUserTransactionListQuery, useGetSIngleUserQuery, useLazyGetSingleUserTransactionListQuery } =
  dashboardApi;
