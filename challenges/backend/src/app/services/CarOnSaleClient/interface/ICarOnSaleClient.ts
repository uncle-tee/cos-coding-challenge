/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
import { ICarOnSaleAuction, ICarOnSaleRunningAuctionResponse, ICarOnSaleRunningAuctions } from './ICarOnSaleAuction';

export interface ICarOnSaleClient {
  /**
   * This is used to get the available auctions for carOnSale, it will return a list of the available auctions
   *
   * @return Promise<ICarOnSaleAuction[]>
   */
  getRunningAuctions(): Promise<ICarOnSaleRunningAuctions>;
}
