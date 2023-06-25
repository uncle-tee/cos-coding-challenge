import { ICarOnSaleAuctionProcessorResult } from '../../CarOnSaleClient/interface/ICarOnSaleAuctionProcessorResult';

/**
 * This is used to process auctions.
 *
 */
export interface ICarOnSaleAuctionProcessor {
  /**
   * This is used to process auctions, and then perform calculations for the
   * avarageNumberOfBids for the action as well as averagePercentageOfAuctionProgress
   *
   * @return Promise<ICarOnSaleAuctionProcessorResult>
   */
  summarizeAuctions(): Promise<ICarOnSaleAuctionProcessorResult>;
}
