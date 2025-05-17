"use client";

import { ShadcnTable } from "@/components/ui/ShadcnTable";
import { transactionHistoryTableColumns } from "./components/transactionHistoryTableColumns";
import DashboardStats from "./components/DashboardStats";

import { useLazyGetUserTransactionListQuery } from "@/redux/dashboardApi";
import { useEffect, useState } from "react";
import { usePostChangeTransactionStatusMutation } from "@/redux/userManagementApi";
import { toast } from "sonner";
import { APIError } from "@/lib/types";
import DashboardFilters from "./components/DashboardFilters";

interface TransactionHistoryData {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  search: string;
  status?: string;
  full_name?: string;
  mobile_number?: string;
  txn_type?: string;
}

export default function Page() {
  
  const [trigger, { data,isLoading }] = useLazyGetUserTransactionListQuery();
  const [transactionHistoryData, setTransactionHistoryData] = useState<TransactionHistoryData>({
    page: 1,
    limit: 10,
    sortBy: "",
    sortOrder: "desc",
    search: "",
    status: "",
    full_name: "",
    mobile_number: "",
    txn_type: ""
  })

  const totalPages = data?.data[0]?.pagination?.totalPages;

  useEffect(() => {
    trigger(transactionHistoryData);
    console.log("transactionHistoryData",transactionHistoryData)
  }, [ trigger, transactionHistoryData]);

  const handlePageChange = (page: number) => {

    setTransactionHistoryData((prevData) => ({
      ...prevData,
      page, 
    }));
  };

  // payment status

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
        trigger(transactionHistoryData);
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
  
    ]);
  

  return (
    <div className="w-full flex flex-col gap-[50px]">
      <DashboardStats />
      <DashboardFilters setTransactionHistoryData={setTransactionHistoryData} trigger={trigger} />
      <ShadcnTable
        pagination={{
          currentPage : transactionHistoryData.page,
          totalPages,
          onPageChange: handlePageChange,
        }}
        isLoading = {isLoading}
        columns={transactionHistoryTableColumns(setTransactionHistoryData, changePaymentStatus)}
        data={data?.data[0]?.data || []}
      />
    </div>
  );
}
