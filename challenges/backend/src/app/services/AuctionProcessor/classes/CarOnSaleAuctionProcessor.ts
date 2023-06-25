import 'reflect-metadata';
import { ICarOnSaleAuctionProcessorResult } from '../../CarOnSaleClient/interface/ICarOnSaleAuctionProcessorResult';
import { inject, injectable } from 'inversify';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { ICarOnSaleClient } from '../../CarOnSaleClient/interface/ICarOnSaleClient';
import { ICarOnSaleAuctionProcessor } from '../interface/ICarOnSaleAuctionProcessor';
import {
  ICarOnSaleRunningAuctions,
} from '../../CarOnSaleClient/interface/ICarOnSaleAuction';
import { ILogger } from '../../Logger/interface/ILogger';

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

  public calculateAverageNumberOfBids(
    { total, items: auctions }: ICarOnSaleRunningAuctions,
  ): number {
    return +auctions
      .filter(auction => auction.numBids)
      .reduce(
        (previous, currentValue) =>
          previous + (+currentValue.numBids / total),
        0,
      )
      .toFixed(2);
  }

  public calculateAveragePercentageOfAuctionProgress(
    { total, items: auctions }: ICarOnSaleRunningAuctions,
  ): number {
    return +auctions
      .filter(
        auction => auction.currentHighestBidValue && auction.minimumRequiredAsk,
      )
      .reduce((previousValue, currentValue) => {
        const { currentHighestBidValue, minimumRequiredAsk } = currentValue;
        const percentageAuctionProgress =
          (currentHighestBidValue / minimumRequiredAsk) * 100;
        return (
          previousValue + (+percentageAuctionProgress / total)
        );
      }, 0)
      .toFixed(2);
  }
}
