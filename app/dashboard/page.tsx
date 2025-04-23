"use client";

import { ShadcnTable } from "@/components/ui/ShadcnTable";
import { transactionHistoryTableColumns } from "./components/transactionHistoryTableColumns";
import DashboardStats from "./components/DashboardStats";

import { useLazyGetUserTransactionListQuery } from "@/redux/dashboardApi";
import { useEffect, useState } from "react";

export default function Page() {
  
  const [trigger, { data,isLoading }] = useLazyGetUserTransactionListQuery();
  const [transactionHistoryData, setTransactionHistoryData] = useState({
    page : 1,
    limit : 10,
    sortBy : "",
    sortOrder : "desc",
    search : ""
  })

  const totalPages = data?.data[0]?.pagination?.totalPages;

  useEffect(() => {
    trigger(transactionHistoryData);
  }, [ trigger, transactionHistoryData]);

  const handlePageChange = (page: number) => {

    setTransactionHistoryData((prevData) => ({
      ...prevData,
      page, 
    }));
  };
  

  return (
    <div className="w-full flex flex-col gap-[50px]">
      <DashboardStats />
      <ShadcnTable
        pagination={{
          currentPage : transactionHistoryData.page,
          totalPages,
          onPageChange: handlePageChange,
        }}
        isLoading = {isLoading}
        columns={transactionHistoryTableColumns(setTransactionHistoryData)}
        data={data?.data[0]?.data || []}
      />
    </div>
  );
}
