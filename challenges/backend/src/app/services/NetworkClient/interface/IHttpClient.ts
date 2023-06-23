export interface IHttpClient {
  get<R>(path: string): Promise<R>;
}
