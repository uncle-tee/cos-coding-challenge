import 'reflect-metadata';
import { ICarOnSaleAuctionProcessorResult } from '../../CarOnSaleClient/interface/ICarOnSaleAuctionProcessorResult';
import { inject, injectable } from 'inversify';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { ICarOnSaleClient } from '../../CarOnSaleClient/interface/ICarOnSaleClient';
import { ICarOnSaleAuctionProcessor } from '../interface/ICarOnSaleAuctionProcessor';
import { ICarOnSaleAuction } from '../../CarOnSaleClient/interface/ICarOnSaleAuction';
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
        averageNumberOfBids: this.calculateAverageNumberOfBids(runningAuctions),
        averagePercentageOfAuctionProgress: this.calculateAveragePercentageOfAuctionProgress(runningAuctions),
        numberOfAuctions: runningAuctions.length,
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
   * @param auctions
   */
  public calculateAverageNumberOfBids(auctions: ICarOnSaleAuction[]): number {
    const auctionBidsCount: number[] = auctions.map(auction => auction.numBids || 0);
    return MathUtil.findAverage(auctionBidsCount);
  }

  /**
   * This method calculates the average percentage of auctions in progress
   * ((1/n) * ∑(i = 1 to n) xᵢ/xj) * 100
   * Where xᵢ is the currentHighestBid for each auction
   * where xj is the minimumRequiredAsk for each auction
   * @param auctions
   */
  public calculateAveragePercentageOfAuctionProgress(auctions: ICarOnSaleAuction[]): number {
    if (!auctions.length) {
      return 0;
    }
    let progressSum = auctions.reduce((previousAuction, currentAuction) => {
      const { currentHighestBidValue, minimumRequiredAsk } = currentAuction;
      if (currentHighestBidValue === null || minimumRequiredAsk === null) {
        return previousAuction;
      }
      if (currentHighestBidValue === 0) {
        return previousAuction;
      }
      return previousAuction + (currentHighestBidValue / minimumRequiredAsk);
    }, 0);

    return +((progressSum / auctions.length) * 100).toFixed(2);


  }
}
