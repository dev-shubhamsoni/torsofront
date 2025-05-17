"use client";

import { ShadcnTable } from "@/components/ui/ShadcnTable";

import { useEffect, useState } from "react";
import { userDetailsTableColumns } from "./components/userDetailsTableColumns";
import {
  useLazyGetUserListQuery,
  usePostAdminUpdateUserProfileMutation,
} from "@/redux/userManagementApi";
import { toast } from "sonner";
import { APIError, APIResponse } from "@/lib/types";
import UserFilters from "./components/userFilters";

interface UserDataState {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  full_name: string;
  mobile_number: string | null;
}

export default function Page() {
  const [trigger, { data, isLoading }] = useLazyGetUserListQuery();

  const [
    triggerUserStatus,
    {
      data: datauserStatus,
      isLoading: isLoadingUserStatus,
      isSuccess: isSuccessUserStatus,
      isError: isErrorUserStatus,
      error: errorUserStatus,
    },
  ] = usePostAdminUpdateUserProfileMutation<APIResponse>();

  const [userDataData, setUserDataData] = useState<UserDataState>({
    page: 1,
    limit: 10,
    sortBy: "",
    sortOrder: "asc",
    search: "",
    full_name: "",
    mobile_number: null,
  });

  const totalPages = data?.data[0]?.pagination?.totalPages;

  useEffect(() => {
    trigger(userDataData);
  }, [trigger, userDataData]);

  const handlePageChange = (page: number) => {
    setUserDataData((prevData) => ({
      ...prevData,
      page,
    }));
  };

  const updateUserStatus = (
    uid: string,
    key: "betting" | "transfer" | "active",
    value: boolean
  ) => {
    // Find the user row by UID
    const user = data?.data[0]?.data.find(
      (user: { uid: string }) => user.uid === uid
    );

    if (!user) return;

    // Construct the updated payload
    const updatedData = {
      uid: user.uid,
      betting: key === "betting" ? value : user.betting,
      transfer: key === "transfer" ? value : user.transfer,
      active: key === "active" ? value : user.active,
    };

    console.log("Sending data to API:", updatedData);
    triggerUserStatus(updatedData);
  };

  useEffect(() => {
    // ✅ Handle successful API response (status: true)
    if (datauserStatus && isSuccessUserStatus && datauserStatus?.status) {
      trigger(userDataData);
      toast.success(datauserStatus?.message);
    }

    // ✅ Handle API response errors (status: false in API response)
    if (datauserStatus && isSuccessUserStatus && !datauserStatus?.status) {
      toast.error(datauserStatus?.message || "Something went wrong");
    }

    // ✅ Handle API request errors (e.g., 401 Unauthorized)
    if (isErrorUserStatus && errorUserStatus) {
      let errorMessage = "An error occurred";

      // ✅ Ensure errorUserStatus is of type APIError
      if ((errorUserStatus as APIError)?.data) {
        const apiError = errorUserStatus as APIError;
        errorMessage = apiError.data.message || "Unauthorized access";
      }

      toast.error(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccessUserStatus,
    datauserStatus,
    isErrorUserStatus,
    errorUserStatus,
    trigger,
  ]);

  return (
    <div className="w-full flex flex-col gap-[50px]">
      <UserFilters setUserDataData={setUserDataData} trigger={trigger} />
      <ShadcnTable
        pagination={{
          currentPage: userDataData.page,
          totalPages,
          onPageChange: handlePageChange,
        }}
        isLoading={isLoading || isLoadingUserStatus}
        columns={userDetailsTableColumns(setUserDataData, updateUserStatus)}
        data={data?.data[0]?.data || []}
      />
    </div>
  );
}
