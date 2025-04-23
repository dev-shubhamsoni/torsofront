"use client";
import { ShadcnTable } from "@/components/ui/ShadcnTable";
import React, { useEffect, useState } from "react";
import { winListColumns } from "./components/winListColumns";
import { AddWinData, AddWinTypes } from "./components/add-win-data";
import { format } from "date-fns";
import {
  useDeleteWinDataMutation,
  useLazyGetWinListQuery,
  useLazyGetWinnersListQuery,
  usePostDeclareWinnersMutation,
  usePostWinDataMutation,
} from "@/redux/winManagementApi";
import { APIError } from "@/lib/types";
import { toast } from "sonner";
import { useApiResponseHandler } from "@/hooks/api-response-handler";
import { winnersListColumns } from "./components/winnersListColumns";

const Page = () => {
  const [trigger, { data, isLoading }] = useLazyGetWinListQuery();

  const [paginationData, setPaginationData] = useState({
    page: 1,
    limit: 10,
    sortBy: "",
    sortOrder: "desc",
    search: "",
    marketToSortId: "",
    gameToSortId: "",
    bidTypeToSortId: "",
    dateToSort: format(Date.now(), "yyyy-MM-dd"),
  });

  // Add win data ->>>>>>>>>>>
  const [
    triggerAddWinData,
    {
      data: dataAddWinData,
      isSuccess: isSuccessAddWinData,
      isError: isErrorAddWinData,
      error: errorAddWinData,
    },
  ] = usePostWinDataMutation();

  useApiResponseHandler({
    data: dataAddWinData,
    isSuccess: isSuccessAddWinData,
    isError: isErrorAddWinData,
    error: errorAddWinData,
    onSuccess: () => {
      trigger(paginationData);
    },
  });

  // Add win data ->>>>>>>>>>>

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

  const triggerWinDataFunc = (data: AddWinTypes) => {
    triggerAddWinData(data);
  };

  // Winners list ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.

  const [
    triggerWinnersList,
    {
      data: dataWinnersList,
      isLoading: isLoadingWinnersList,
      isSuccess: isSuccessWinnersList,
      isError: isErrorWinnersList,
      error: errorWinnersList,
    },
  ] = useLazyGetWinnersListQuery();

  const totalPagesWinners = dataWinnersList?.data[0]?.pagination?.totalPages;

  const [paginationDataWinners, setPaginationDataWinners] = useState({
    page: 1,
    limit: 10,
    sortBy: "",
    sortOrder: "desc",
    search: "",

    bidTypeToSortId: "",
    dateToSort: format(Date.now(), "yyyy-MM-dd"),
  });

  const winnersListFunc = (
    marketId: string,
    gameId: string,
    bid_type: string,
    win_number: number,
    resultDate: Date
  ) => {
    const main = {
      ...paginationDataWinners,
      marketId,
      gameId,
      bid_type,
      win_number,
      resultDate,
    };

    console.log("main", main);

    triggerWinnersList(main);
  };

  const handlePageChangeWinners = (page: number) => {
    setPaginationDataWinners((prevData) => ({
      ...prevData,
      page,
    }));
  };

  // Delete Win Data

  const [
    triggerDeleteWinData,
    {
      data: dataDeleteWinData,
      isSuccess: isSuccessDeleteWinData,
      isError: isErrorDeleteWinData,
      error: errorDeleteWinData,
    },
  ] = useDeleteWinDataMutation();

  useApiResponseHandler({
    data: dataDeleteWinData,
    isSuccess: isSuccessDeleteWinData,
    isError: isErrorDeleteWinData,
    error: errorDeleteWinData,
    onSuccess: () => {
      trigger(paginationData);
    },
  });

  const delWinData = (id: string) => {
    console.log("id", id);
    triggerDeleteWinData(id);
  };

  // Declare winners

  const [
    triggerDeclareWinners,
    {
      data: dataDeclareWinners,
      isSuccess: isSuccessDeclareWinners,
      isError: isErrorDeclareWinners,
      error: errorDeclareWinners,
    },
  ] = usePostDeclareWinnersMutation();

  useApiResponseHandler({
    data: dataDeclareWinners,
    isSuccess: isSuccessDeclareWinners,
    isError: isErrorDeclareWinners,
    error: errorDeclareWinners,
    onSuccess: () => {
      trigger(paginationData);
    },
  });

  const decWinner = (marketId, gameId, bid_amount, bid_type, resultDate) => {
    triggerDeclareWinners({
      marketId,
      gameId,
      bid_amount,
      bid_type,
      resultDate,
    });
  };

  return (
    <div className="w-full flex flex-col gap-[50px]">
      <AddWinData triggerWinDataFunc={triggerWinDataFunc} />

      <ShadcnTable
        pagination={{
          currentPage: paginationData.page,
          totalPages,
          onPageChange: handlePageChange,
        }}
        isLoading={isLoading}
        columns={winListColumns(setPaginationData, delWinData, winnersListFunc,decWinner)}
        data={data?.data[0]?.data || []}
      />

      <ShadcnTable
        pagination={{
          currentPage: paginationDataWinners.page,
          totalPages: totalPagesWinners,
          onPageChange: handlePageChangeWinners,
        }}
        isLoading={isLoadingWinnersList}
        columns={winnersListColumns(setPaginationDataWinners)}
        data={dataWinnersList?.data[0]?.data || []}
      />
    </div>
  );
};

export default Page;
