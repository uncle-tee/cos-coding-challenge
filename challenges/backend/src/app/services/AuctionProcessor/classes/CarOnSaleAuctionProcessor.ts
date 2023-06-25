import 'reflect-metadata';
import { ICarOnSaleAuctionProcessorResult } from '../../CarOnSaleClient/interface/ICarOnSaleAuctionProcessorResult';
import { inject, injectable } from 'inversify';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { ICarOnSaleClient } from '../../CarOnSaleClient/interface/ICarOnSaleClient';
import { ICarOnSaleAuctionProcessor } from '../interface/ICarOnSaleAuctionProcessor';
import { ICarOnSaleRunningAuctions } from '../../CarOnSaleClient/interface/ICarOnSaleAuction';
import { ILogger } from '../../Logger/interface/ILogger';
import { MathUtil } from '../../Util/MathUtil';

@injectable()
export class CarOnSaleAuctionProcessor implements ICarOnSaleAuctionProcessor {
  constructor(
    @inject(DependencyIdentifier.CAR_ON_SALE_CLIENT)
    private carOnSaleClient: ICarOnSaleClient,
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
  ) {}

  async summarizeAuctions(): Promise<ICarOnSaleAuctionProcessorResult> {
    try {
      const runningAuctions = await this.carOnSaleClient.getRunningAuctions();
      return {
        averageNumberOfBids:
          this.calculateAverageNumberOfBids(runningAuctions),
        averagePercentageOfAuctionProgress:
          this.calculateAveragePercentageOfAuctionProgress(runningAuctions),
        numberOfAuctions: runningAuctions.total,
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  /**
   * This is used to find the average number of bids,
   * it is the sum of the num of bids of each auction / total number of auctions
   * (1/n) * ∑(i = 1 to n) xᵢ where n represents the total number of auctions in the array
   * and xᵢ represents each individual value of the numberOfBids for each auction
   * @param total The total number of actions
   * @param auctions
   */
  public calculateAverageNumberOfBids(
    { total, items: auctions }: ICarOnSaleRunningAuctions,
  ): number {
    const auctionBidsCount: number[] = auctions.map(auction => (auction.numBids || 0));
    return MathUtil.findAverage(auctionBidsCount);
  }


  /**
   * This method calculates the average percentage of auctions in progress
   * ((1/n) * ∑(i = 1 to n) xᵢ/xj) * 100
   * Where xᵢ is the currentHighestBid for each auction
   * where xj is the minimumRequiredAsk for each auction
   * @param total
   * @param auctions
   */
  public calculateAveragePercentageOfAuctionProgress(
    { total, items: auctions }: ICarOnSaleRunningAuctions,
  ): number {
    const sumOfAuctionProgress: number[] = auctions
      .filter(
        auction => auction.currentHighestBidValue && auction.minimumRequiredAsk,
      )
      .map((auction) => {
        const { currentHighestBidValue, minimumRequiredAsk } = auction;
        return (currentHighestBidValue / minimumRequiredAsk);
      });

    return +(100 * MathUtil.findAverage(sumOfAuctionProgress)).toFixed(2);

  }
}
