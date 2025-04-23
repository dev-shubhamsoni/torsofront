"use client";
import { useEffect, useState } from "react";
import { gameListColumns } from "./components/gameListColumns";
import {
  useLazyGetGameListQuery,
  usePostAddGameMutation,
  usePostUpdateGameMutation,
} from "@/redux/gameManagementApi";
import { ShadcnTable } from "@/components/ui/ShadcnTable";
import { APIError } from "@/lib/types";
import { toast } from "sonner";
import AddGame from "./components/add-game";

const Page = () => {
  const [trigger, { data, isLoading }] = useLazyGetGameListQuery();
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

  // Add Game

  const [
    triggerAddGame,
    {
      data: dataAddGame,
      isLoading: isLoadingAddGame,
      isSuccess: isSuccessAddGame,
      isError: isErrorAddGame,
      error: errorAddGame,
    },
  ] = usePostAddGameMutation();

  useEffect(() => {
    // ✅ Handle successful API response (status: true)
    if (dataAddGame && isSuccessAddGame && dataAddGame?.status) {
      toast.success(dataAddGame?.message);
      trigger(paginationData);
    }

    // ✅ Handle API response errors (status: false in API response)
    if (dataAddGame && isSuccessAddGame && !dataAddGame?.status) {
      toast.error(dataAddGame?.message || "Something went wrong");
    }

    // ✅ Handle API request errors (e.g., 401 Unauthorized)
    if (isErrorAddGame && errorAddGame) {
      let errorMessage = "An error occurred";

      // ✅ Ensure errorAddGame is of type APIError
      if ((errorAddGame as APIError)?.data) {
        const apiError = errorAddGame as APIError;
        errorMessage = apiError.data.message || "Unauthorized access";
      }

      toast.error(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessAddGame, dataAddGame, isErrorAddGame, errorAddGame, trigger]);

  // Update Game

  const [
    triggerUpdateGame,
    {
      data: dataUpdateGame,

      isSuccess: isSuccessUpdateGame,
      isError: isErrorUpdateGame,
      error: errorUpdateGame,
    },
  ] = usePostUpdateGameMutation();

  useEffect(() => {
    // ✅ Handle successful API response (status: true)
    if (dataUpdateGame && isSuccessUpdateGame && dataUpdateGame?.status) {
      toast.success(dataUpdateGame?.message);
      trigger(paginationData);
    }

    // ✅ Handle API response errors (status: false in API response)
    if (dataUpdateGame && isSuccessUpdateGame && !dataUpdateGame?.status) {
      toast.error(dataUpdateGame?.message || "Something went wrong");
    }

    // ✅ Handle API request errors (e.g., 401 Unauthorized)
    if (isErrorUpdateGame && errorUpdateGame) {
      let errorMessage = "An error occurred";

      // ✅ Ensure errorUpdateGame is of type APIError
      if ((errorUpdateGame as APIError)?.data) {
        const apiError = errorUpdateGame as APIError;
        errorMessage = apiError.data.message || "Unauthorized access";
      }

      toast.error(errorMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccessUpdateGame,
    dataUpdateGame,
    isErrorUpdateGame,
    errorUpdateGame,
    trigger,
  ]);

  return (
    <div className="w-full flex flex-col gap-[50px]">
      <AddGame
        triggerAddGame={triggerAddGame}
        isLoadingAddGame={isLoadingAddGame}
      />
      <ShadcnTable
        pagination={{
          currentPage: paginationData.page,
          totalPages,
          onPageChange: handlePageChange,
        }}
        isLoading={isLoading}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columns={gameListColumns(setPaginationData, triggerUpdateGame)}
        data={data?.data[0]?.data || []}
      />
    </div>
  );
};

export default Page;
