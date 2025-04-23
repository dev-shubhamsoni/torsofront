// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface APIResponse<T = any> {
    status: boolean;
    statusCode: number;
    message: string;
    isLoading : boolean;
    isSuccess : boolean;
    isError : boolean;
    error : APIError;
    data: T;
  }
  
  // ✅ Type for error response from RTK Query
  export interface APIError {
    status: number; // e.g., 401
    data: {
      status: boolean;
      statusCode: number;
      message: string;
      data: string[];
    };
  }
  