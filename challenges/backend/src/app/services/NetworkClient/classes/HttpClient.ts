import axios, { AxiosHeaderValue, AxiosInstance, AxiosResponse } from 'axios';
import { HttpClientException } from '../exceptions/HttpClientException';

export abstract class HttpClient {
  protected axiosInstance: AxiosInstance;

  protected constructor(private readonly baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });

    this._initializeResponseInterceptor();
  }

  get<R>(
    path: string,
    headers?: { [key: string]: AxiosHeaderValue },
  ): Promise<R> {
    return this.axiosInstance.get(path, {
      headers: { 'User-Agent': 'proxy', ...headers },
    });
  }

  put<Request, Response>(path: string, body: Request): Response {
    return this.axiosInstance.put(path, body, {}) as Response;
  }

  private _initializeResponseInterceptor = () => {
    this.axiosInstance.interceptors.response.use(
      this._handleResponse,
      this._handleError,
    );
  };

  private _handleResponse = ({ data }: AxiosResponse) => data;

  private _handleError = (error: any) => {
    if (error?.response?.status >= 400) {
      throw new HttpClientException(error.response.status, error.response.data);
    }
    throw new Error(error);
  };
}
