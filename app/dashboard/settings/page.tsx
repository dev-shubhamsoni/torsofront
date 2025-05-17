"use client";

import { useGetAdminDetailsQuery, usePostUpdateAdminDetailsMutation } from "@/redux/adminManagementApi";
import AdminDetails from "./components/adminDetails";
import { useEffect } from "react";
import { toast } from "sonner";
import { APIError } from "@/lib/types";

export default function Page() {
  const {data : adminData} = useGetAdminDetailsQuery({});
  const [
    triggerUpdateAdmin,
    {
      data: dataUpdateAdmin,
      isSuccess: isSuccessUpdateAdmin,
      isError: isErrorUpdateAdmin,
      error: errorUpdateAdmin,
    },
  ] = usePostUpdateAdminDetailsMutation();

  useEffect(() => {
    // ✅ Handle successful API response (status: true)
    if (dataUpdateAdmin && isSuccessUpdateAdmin && dataUpdateAdmin?.status) {
      toast.success(dataUpdateAdmin?.message);
    }

    // ✅ Handle API response errors (status: false in API response)
    if (dataUpdateAdmin && isSuccessUpdateAdmin && !dataUpdateAdmin?.status) {
      toast.error(dataUpdateAdmin?.message || "Something went wrong");
    }

    // ✅ Handle API request errors (e.g., 401 Unauthorized)
    if (isErrorUpdateAdmin && errorUpdateAdmin) {
      let errorMessage = "An error occurred";

      // ✅ Ensure errorUpdateAdmin is of type APIError
      if ((errorUpdateAdmin as APIError)?.data) {
        const apiError = errorUpdateAdmin as APIError;
        errorMessage = apiError.data.message || "Unauthorized access";
      }

      toast.error(errorMessage);
    }
  }, [
    isSuccessUpdateAdmin,
    dataUpdateAdmin,
    isErrorUpdateAdmin,
    errorUpdateAdmin,
  ]);

  return (
    <div className="w-full flex flex-col gap-[50px]">
      <AdminDetails 
        adminData={adminData?.data[0]} 
        onSubmit={triggerUpdateAdmin}
      />
    </div>
  );
}
