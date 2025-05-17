import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./middlewareBaseQuery";

export const adminManagementApi = createApi({
  reducerPath: "adminManagementApi",
  baseQuery: baseQueryWithAuth,

  endpoints: (builder) => ({
   
    postUpdateAdminDetails: builder.mutation({
      query: (body) => ({
        url: "/admin/post-admin-details",
        method: "POST",
        body,
      }),
    }),
    getAdminDetails: builder.query({
      query: () => `/admin/get-admin-details`,
    }),

    
  }),
});

export const {  usePostUpdateAdminDetailsMutation, useGetAdminDetailsQuery} =
  adminManagementApi;
