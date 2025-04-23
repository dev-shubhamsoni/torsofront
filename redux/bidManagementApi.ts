import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./middlewareBaseQuery";

export const bidManagementApi = createApi({
  reducerPath: "bidManagementApi",
  baseQuery: baseQueryWithAuth,

  endpoints: (builder) => ({
    getBidList: builder.query({
      query: (user) =>
        `/admin/all-bid-list?page=${user?.page}&limit=${user?.limit}&sortBy=${user?.sortBy}&sortOrder=${user?.sortOrder}&search=${user?.search}&dateToSort=${user?.dateToSort}&marketToSortId=${user?.marketToSortId}&gameToSortId=${user?.gameToSortId}&bidTypeToSortId=${user?.bidTypeToSortId}`,
    }),
  }),
});

export const { useLazyGetBidListQuery } = bidManagementApi;
