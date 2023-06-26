import 'reflect-metadata';
import {
  ICarOnSaleAuction,
  ICarOnSaleAuthenticationRequest,
  ICarOnSaleRunningAuctionResponse,
} from '../interface/ICarOnSaleAuction';
import { inject, injectable } from 'inversify';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { ILogger } from '../../Logger/interface/ILogger';
import config from 'config';
import { ICarOnSaleClient } from '../interface/ICarOnSaleClient';
import { HttpClient } from '../../NetworkClient/classes/HttpClient';
import { HttpClientException } from '../../NetworkClient/exceptions/HttpClientException';
import { CarOnSaleException, ErrorMessage } from '../exeptions/CarOnSaleException';

@injectable()
export class CarOnSaleClient extends HttpClient implements ICarOnSaleClient {
  private authCredentials: { token: string; userId: string };

  constructor(@inject(DependencyIdentifier.LOGGER) private logger: ILogger) {
    super(config.get('api.carOnSale.url'));
  }


  /**
   *  This method retrieves running auctions from the running auction endpoint using fetchAuctions.
   *    Due to the uncertainty of the endpoint returning a large number of records,
   *    it loops through the requests using limit and offset. It will continue pulling the records until the auctions
   *    in memory are equal to the total count.
   *    @return Promise<ICarOnSaleAuction[]> - A promise that resolves to an array of running auctions.
   *    @throws CarOnSaleException - If an exception occurs during the retrieval process.
   */
  async getRunningAuctions(): Promise<ICarOnSaleAuction[]> {
    const auctions: ICarOnSaleAuction[] = [];
    let total = 0;
    const limit: number = +config.get<number>('api.carOnSale.limit');
    let hasMoreData = true;
    await this.authenticate();
    try {
      while (hasMoreData) {
        const auctionItems = await this.fetchAuctions({ limit, offset: auctions.length });
        auctions.push(...auctionItems.items);
        total = auctionItems.total;
        hasMoreData = auctions.length < auctionItems.total;
      }
      return auctions;
    } catch (e) {
      if (e instanceof HttpClientException) {
        this.logger.error(`Fetching Auction Failed`, {
          statusCode: e.status,
          message: e.data.message,
        });
        throw new CarOnSaleException(ErrorMessage.FETCH_AUCTIONS);
      }
      throw e;
    }
  }

  async fetchAuctions({ limit, offset }: { limit: number; offset: number }): Promise<ICarOnSaleRunningAuctionResponse> {
    const queryParams = {
      filter: JSON.stringify({ limit, offset }),
    };
    return this.get('/v2/auction/buyer/', queryParams, {
      authtoken: this.authCredentials.token,
      userid: this.authCredentials.userId,
    });
  }

  /**
   * This method is used to get authentication credentials, when no credentials for the service exist
   * @return void
   * @private
   */
  private async authenticate() {
    const { email, password } = config.get<ICarOnSaleAuthenticationRequest>('api.carOnSale');
    try {
      if (!this.authCredentials) {
        this.authCredentials = await this.put(`/v1/authentication/${email}`, {
          password,
        });
        if (!this.authCredentials.userId || !this.authCredentials.token)
          throw new CarOnSaleException(ErrorMessage.AUTHENTICATION);
      }
    } catch (e) {
      if (e instanceof HttpClientException) {
        this.logger.error(`Failed to authenticate`, {
          statusCode: e.status,
          message: e.data.message,
        });
      }
      throw new CarOnSaleException(ErrorMessage.AUTHENTICATION);
    }
  }
}
