import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { toast } from "sonner";

interface APIError {
  status: number;
  data: {
    status: boolean;
    statusCode: number;
    message: string;
    data: string[];
  };
}

interface ApiResponse<T extends { status: boolean; message: string }> {
  data: T | null;
  isSuccess: boolean;
  isError: boolean;
  error: APIError | FetchBaseQueryError | SerializedError | null | undefined;
  onSuccess?: (data: T) => void;
  onError?: () => void; // ✅ Now only requires a function, no arguments
}

export function useApiResponseHandler<
  T extends { status: boolean; message: string }
>({ data, isSuccess, isError, error, onSuccess, onError }: ApiResponse<T>) {
  useEffect(() => {


    if (!isSuccess && !isError) return;


    if (data && data.status && isSuccess) {
      const successMessage = data.message || "Successful!";
      toast.success(successMessage);
      onSuccess?.(data);
    }

    if (data && data.status === false && isSuccess) {
  
 
      const errorMessage = data.message || "Something went wrong";
      toast.error(errorMessage);
      onError?.();
    }

    if (isError && isSuccess && error) {
      let errorMessage = "An error occurred";

      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in error.data &&
        typeof error.data.message === "string"
      ) {
        errorMessage = error.data.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      onError?.(); // ✅ Execute onError callback without arguments
    }
  }, [data, isSuccess, isError, error]);
}
