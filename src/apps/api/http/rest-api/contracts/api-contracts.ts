export interface ApiErrorResponse {
  error: {
    statusCode: number;
    requestId: string;
    message: string;
    timestamp: string;
  };
}

export interface ApiSuccessResponse<T = unknown> {
  data: T;
  meta: {
    timestamp: string;
    requestId: string;
  };
}

export interface ApiCursorPaginatedResponse<T = unknown> {
  data: T[];
  meta: {
    pagination: {
      next: string | null;
      prev: string | null;
    };
    timestamp: string;
    requestId: string;
  };
}
