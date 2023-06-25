import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { HttpClientException } from '../exceptions/HttpClientException';

export abstract class HttpClient {
  protected axiosInstance: AxiosInstance;

  protected constructor(private readonly baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });

    this._initializeResponseInterceptor();
  }

  get<R>(path: string, params: { [key: string]: string }, headers?: { [key: string]: string }): Promise<R> {
    return this.axiosInstance.get(path, {
      params,
      headers: {
        'User-Agent': 'proxy',
        Accept: 'application/json',
        ...headers,
      },
    });
  }

  put<Request, Response>(path: string, body: Request): Response {
    return this.axiosInstance.put(path, body, {}) as Response;
  }

  private _initializeResponseInterceptor = () => {
    this.axiosInstance.interceptors.response.use(this._handleResponse, this._handleError);
  };

  private _handleResponse = ({ data }: AxiosResponse) => data;

  private _handleError = (error: any) => {
    if (error?.response?.status >= 400) {
      throw new HttpClientException(error.response.status, error.response.data);
    }
    throw new Error(error);
  };
}
