"use client";
import { ShadcnTable } from "@/components/ui/ShadcnTable";
import {
  useLazyGetMarketListQuery,
  usePostAddMarketMutation,
} from "@/redux/marketManagementApi";
import React, { useEffect, useState } from "react";
import { marketListColumns } from "./components/marketListColumns";
import AddMarket from "./components/add-market";
import { toast } from "sonner";
import { APIError } from "@/lib/types";

const Page = () => {
  const [trigger, { data, isLoading }] = useLazyGetMarketListQuery();
  const [paginationData, setPaginationData] = useState({
    page: 1,
    limit: 10,
    sortBy: "",
    sortOrder: "desc",
    search: "",
  });

  const totalPages = data?.data[0]?.pagination?.totalPages;

  useEffect(() => {
    trigger(paginationData);
  }, [trigger, paginationData]);

  const handlePageChange = (page: number) => {
    setPaginationData((prevData) => ({
      ...prevData,
      page,
    }));
  };

  // Add Market

  const [
    triggerAddMarket,
    {
      data: dataAddMarket,
      isLoading: isLoadingAddMarket,
      isSuccess: isSuccessAddMarket,
      isError: isErrorAddMarket,
      error: errorAddMarket,
    },
  ] = usePostAddMarketMutation();

  useEffect(() => {
    // ✅ Handle successful API response (status: true)
    if (dataAddMarket && isSuccessAddMarket && dataAddMarket?.status) {
      toast.success(dataAddMarket?.message);
      trigger(paginationData);
    }

    // ✅ Handle API response errors (status: false in API response)
    if (dataAddMarket && isSuccessAddMarket && !dataAddMarket?.status) {
      toast.error(dataAddMarket?.message || "Something went wrong");
    }

    // ✅ Handle API request errors (e.g., 401 Unauthorized)
    if (isErrorAddMarket && errorAddMarket) {
      let errorMessage = "An error occurred";

      // ✅ Ensure errorAddMarket is of type APIError
      if ((errorAddMarket as APIError)?.data) {
        const apiError = errorAddMarket as APIError;
        errorMessage = apiError.data.message || "Unauthorized access";
      }

      toast.error(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccessAddMarket,
    dataAddMarket,
    isErrorAddMarket,
    errorAddMarket,
    trigger,
  ]);
  

  return (
    <div className="w-full flex flex-col gap-[50px]">
      <AddMarket
        triggerAddMarket={triggerAddMarket}
        isLoadingAddMarket={isLoadingAddMarket}
      />
      <ShadcnTable
        pagination={{
          currentPage: paginationData.page,
          totalPages,
          onPageChange: handlePageChange,
        }}
        isLoading={isLoading}
        columns={marketListColumns(setPaginationData)}
        data={data?.data[0]?.data || []}
      />
    </div>
  );
};

export default Page;
