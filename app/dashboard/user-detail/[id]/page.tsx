"use client";

import {
  useGetSIngleUserQuery,
  useLazyGetSingleUserTransactionListQuery,
} from "@/redux/dashboardApi";
import { useParams } from "next/navigation";
import UserDetails from "./components/userDetails";
import { ShadcnTable } from "@/components/ui/ShadcnTable";
import { useEffect, useState } from "react";
import { userDetailsTableColumnsSingleTransactions } from "./components/userDetailsTableColumnsSingleTransactions";
import {
  usePostAdminAddMoneyMutation,
  usePostAdminRemoveMoneyMutation,
  usePostChangeTransactionStatusMutation,
} from "@/redux/userManagementApi";
import { toast } from "sonner";
import { APIError } from "@/lib/types";

export default function Page() {
  const params = useParams();
  const id = params?.id;
  const uidString = Array.isArray(id) ? id[0] : id ?? "";

  const { data, refetch } = useGetSIngleUserQuery(id, { skip: !id });
  const [trigger, { data: userTxnData, isLoading }] =
    useLazyGetSingleUserTransactionListQuery();
  const userData = data?.data[0];

  const [userDataData, setUserDataData] = useState({
    page: 1,
    limit: 10,
    sortBy: "",
    sortOrder: "desc",
    search: "",
    uid: id,
  });

  useEffect(() => {
    trigger(userDataData);
  }, [trigger, userDataData]);

  const totalPages = userTxnData?.data[0]?.pagination?.totalPages;

  const handlePageChange = (page: number) => {
    setUserDataData((prevData) => ({
      ...prevData,
      page,
    }));
  };

  // Add Money

  const [
    triggerAddMoney,
    {
      data: dataAddMoney,
      isSuccess: isSuccessAddMoney,
      isError: isErrorAddMoney,
      error: errorAddMoney,
    },
  ] = usePostAdminAddMoneyMutation();

  useEffect(() => {
    // ✅ Handle successful API response (status: true)
    if (dataAddMoney && isSuccessAddMoney && dataAddMoney?.status) {
      toast.success(dataAddMoney?.message);
      trigger(userDataData);
      refetch();
    }

    // ✅ Handle API response errors (status: false in API response)
    if (dataAddMoney && isSuccessAddMoney && !dataAddMoney?.status) {
      toast.error(dataAddMoney?.message || "Something went wrong");
    }

    // ✅ Handle API request errors (e.g., 401 Unauthorized)
    if (isErrorAddMoney && errorAddMoney) {
      let errorMessage = "An error occurred";

      // ✅ Ensure errorAddMoney is of type APIError
      if ((errorAddMoney as APIError)?.data) {
        const apiError = errorAddMoney as APIError;
        errorMessage = apiError.data.message || "Unauthorized access";
      }

      toast.error(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccessAddMoney,
    dataAddMoney,
    isErrorAddMoney,
    errorAddMoney,
    trigger,
    refetch,
  ]);

  // Remove Money

  const [
    triggerRemoveMoney,
    {
      data: dataRemoveMoney,
      isSuccess: isSuccessRemoveMoney,
      isError: isErrorRemoveMoney,
      error: errorRemoveMoney,
    },
  ] = usePostAdminRemoveMoneyMutation();

  useEffect(() => {
    // ✅ Handle successful API response (status: true)
    if (dataRemoveMoney && isSuccessRemoveMoney && dataRemoveMoney?.status) {
      toast.success(dataRemoveMoney?.message);
      trigger(userDataData);
      refetch();
    }

    // ✅ Handle API response errors (status: false in API response)
    if (dataRemoveMoney && isSuccessRemoveMoney && !dataRemoveMoney?.status) {
      toast.error(dataRemoveMoney?.message || "Something went wrong");
    }

    // ✅ Handle API request errors (e.g., 401 Unauthorized)
    if (isErrorRemoveMoney && errorRemoveMoney) {
      let errorMessage = "An error occurred";

      // ✅ Ensure errorRemoveMoney is of type APIError
      if ((errorRemoveMoney as APIError)?.data) {
        const apiError = errorRemoveMoney as APIError;
        errorMessage = apiError.data.message || "Unauthorized access";
      }

      toast.error(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccessRemoveMoney,
    dataRemoveMoney,
    isErrorRemoveMoney,
    errorRemoveMoney,
    trigger,
    refetch,
  ]);

  // Payment Status change
  const [
    triggerChangeStatus,
    {
      data: dataChangeStatus,
      isSuccess: isSuccessChangeStatus,
      isError: isErrorChangeStatus,
      error: errorChangeStatus,
    },
  ] = usePostChangeTransactionStatusMutation();

  const changePaymentStatus = (
    status: string,
    id: string,
    txnType: string,
    userId: string,
    amount: number
  ) => {
    triggerChangeStatus({ status, tranId: id, tranType:txnType, userMainId:userId, tranAmount:amount });
  };

  useEffect(() => {
    // ✅ Handle successful API response (status: true)
    if (dataChangeStatus && isSuccessChangeStatus && dataChangeStatus?.status) {
      toast.success(dataChangeStatus?.message);
      trigger(userDataData);
      refetch();
    }

    // ✅ Handle API response errors (status: false in API response)
    if (
      dataChangeStatus &&
      isSuccessChangeStatus &&
      !dataChangeStatus?.status
    ) {
      toast.error(dataChangeStatus?.message || "Something went wrong");
    }

    // ✅ Handle API request errors (e.g., 401 Unauthorized)
    if (isErrorChangeStatus && errorChangeStatus) {
      let errorMessage = "An error occurred";

      // ✅ Ensure errorChangeStatus is of type APIError
      if ((errorChangeStatus as APIError)?.data) {
        const apiError = errorChangeStatus as APIError;
        errorMessage = apiError.data.message || "Unauthorized access";
      }

      toast.error(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccessChangeStatus,
    dataChangeStatus,
    isErrorChangeStatus,
    errorChangeStatus,
    trigger,
    refetch,
  ]);

  return (
    <div className="flex flex-col gap-12">
      <UserDetails
        userData={userData}
        triggerAddMoney={triggerAddMoney}
        triggerRemoveMoney={triggerRemoveMoney}
        uid={uidString}
      />
      <ShadcnTable
        pagination={{
          currentPage: userDataData.page,
          totalPages,
          onPageChange: handlePageChange,
        }}
        isLoading={isLoading}
        columns={userDetailsTableColumnsSingleTransactions(
          setUserDataData,
          changePaymentStatus
        )}
        data={userTxnData?.data[0]?.data || []}
      />
    </div>
  );
}
