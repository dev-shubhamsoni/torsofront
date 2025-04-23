"use client";
import { ShadcnTable } from "@/components/ui/ShadcnTable";
import React, { useEffect, useState } from "react";
import { bidListColumns } from "./components/bidListColumns";
import { useLazyGetBidListQuery } from "@/redux/bidManagementApi";
import { FilterBids } from "./components/filter-bids";
import { format } from "date-fns";

const Page = () => {
  const [trigger, { data, isLoading }] = useLazyGetBidListQuery();
  const [paginationData, setPaginationData] = useState({
    page: 1,
    limit: 10,
    sortBy: "",
    sortOrder: "desc",
    search: "",
    marketToSortId: "",
    gameToSortId: "",
    bidTypeToSortId: "",
    dateToSort: format(Date.now(), "yyyy-MM-dd") 
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

  const triggerFilter = () => {


  }

  
  return (
    <div className="w-full flex flex-col gap-[50px]">
       {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
 {/* @ts-ignore */}
      <FilterBids setPaginationData = {setPaginationData} triggerFilter = {triggerFilter}/>

      <ShadcnTable
        pagination={{
          currentPage: paginationData.page,
          totalPages,
          onPageChange: handlePageChange,
        }}
        isLoading={isLoading}
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
 // @ts-ignore
        columns={bidListColumns(setPaginationData)}
        data={data?.data[0]?.data || []}
      />
    </div>
  );
};

export default Page;
