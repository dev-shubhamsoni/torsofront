import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "./middlewareBaseQuery";

export const userManagementApi = createApi({
  reducerPath: "userManagementApi",
  baseQuery: baseQueryWithAuth,

  endpoints: (builder) => ({
    getUserList: builder.query({
      query: (user) =>
        `/admin/user-list?page=${user?.page}&limit=${user?.limit}&sortBy=${user?.sortBy}&sortOrder=${user?.sortOrder}&search=${user?.search}${user?.full_name ? `&full_name=${user.full_name}` : ''}${user?.mobile_number ? `&mobile_number=${user.mobile_number}` : ''}`,
    }),

    postAdminUpdateUserProfile: builder.mutation({
      query: (body) => ({
        url: "/admin/post-admin-update-user-profile",
        method: "POST",
        body,
      }),
    }),

    postAdminAddMoney: builder.mutation({
      query: (body) => ({
        url: "/admin/admin-add-money",
        method: "POST",
        body,
      }),
    }),

    postAdminRemoveMoney: builder.mutation({
      query: (body) => ({
        url: "/admin/admin-remove-money",
        method: "POST",
        body,
      }),
    }),

    postChangeTransactionStatus: builder.mutation({
      query: (body) => ({
        url: "/admin/update-transaction-status",
        method: "POST",
        body,
      }),
    }),
    
  }),
});

export const {  useLazyGetUserListQuery, usePostAdminUpdateUserProfileMutation, usePostAdminAddMoneyMutation, usePostAdminRemoveMoneyMutation, usePostChangeTransactionStatusMutation } =
  userManagementApi;
