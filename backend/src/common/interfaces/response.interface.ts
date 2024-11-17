export interface IApiResponse<T> {
  statusCode: number;
  data: T;
  message?: string;
  error?: string;
}
