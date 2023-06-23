import { IHttpClient } from '../interface/IHttpClient';
import axios, { AxiosHeaderValue, AxiosInstance, AxiosResponse } from 'axios';
import { HttpClientException } from '../exceptions/HttpClientException';
import { injectable, unmanaged } from 'inversify';

export abstract class HttpClient {
  protected axiosInstance: AxiosInstance;

  protected constructor(baseUrl: string) {
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
      headers: { 'User-Agent': 'agent', ...headers },
    });
  }

  private _initializeResponseInterceptor = () => {
    this.axiosInstance.interceptors.response.use(
      this._handleResponse,
      this._handleError,
    );
  };

  private _handleResponse = ({ data }: AxiosResponse) => data;

  private _handleError = (error: any) => {
    if (
      error &&
      error.response &&
      error.response.status >= 400 &&
      error.response.status <= 499
    ) {
      throw new HttpClientException(error.response.status, error.response.data);
    }
    throw new Error(error);
  };
}
