import 'reflect-metadata';
import { ICarOnSaleAuction } from '../interface/ICarOnSaleAuction';
import { inject, injectable } from 'inversify';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { ILogger } from '../../Logger/interface/ILogger';
import config from 'config';
import { ICarOnSaleClient } from '../interface/ICarOnSaleClient';
import { HttpClient } from '../../NetworkClient/classes/HttpClient';
import { HttpClientException } from '../../NetworkClient/exceptions/HttpClientException';
import {
  CarOnSaleException,
  ErrorMessage,
} from '../exeptions/CarOnSaleException';

@injectable()
export class CarOnSaleClient extends HttpClient implements ICarOnSaleClient {
  private authCredentials: { token: string; userId: string };

  constructor(@inject(DependencyIdentifier.LOGGER) private logger: ILogger) {
    super(config.get('api.carOnSale.url'));
  }

  async getRunningAuctions(): Promise<ICarOnSaleAuction[]> {
    await this.authenticate();
    try {
      return await this.get('/v2/auction/buyer', {
        authtoken: this.authCredentials.token,
        userid: this.authCredentials.userId,
      });
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

  /**
   * This method is used to get authentication credentials, when no credentials for the service exist
   * @return void
   * @private
   */
  private async authenticate() {
    const { email, password } = config.get<{ email: string; password: string }>(
      'api.carOnSale',
    );
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
