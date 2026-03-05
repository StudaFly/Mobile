export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
}

export interface NetworkError {
  message: string;
  isNetworkError: true;
}
