import 'reflect-metadata';
import { ICarOnSaleAuctionProcessorResult } from '../../CarOnSaleClient/interface/ICarOnSaleAuctionProcessorResult';
import { inject, injectable } from 'inversify';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { ICarOnSaleClient } from '../../CarOnSaleClient/interface/ICarOnSaleClient';
import { ICarOnSaleAuctionProcessor } from '../interface/ICarOnSaleAuctionProcessor';
import { ICarOnSaleAuction } from '../../CarOnSaleClient/interface/ICarOnSaleAuction';
import { ILogger } from '../../Logger/interface/ILogger';

@injectable()
export class CarOnSaleAuctionProcessor implements ICarOnSaleAuctionProcessor {
  constructor(
    @inject(DependencyIdentifier.CAR_ON_SALE_CLIENT)
    private carOnSaleClient: ICarOnSaleClient,
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
  ) {}

  async processor(): Promise<ICarOnSaleAuctionProcessorResult> {
    try {
      let availableAuctions = await this.carOnSaleClient.getRunningAuctions();
      return {
        averageNumberOfBids:
          CarOnSaleAuctionProcessor.calculateAverageNumberOfBids(
            availableAuctions,
          ),
        averagePercentageOfAuctionProgress:
          CarOnSaleAuctionProcessor.calculateAveragePercentageOdAuctionProgress(
            availableAuctions,
          ),
        numberOfAuctions: availableAuctions.length,
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  private static calculateAverageNumberOfBids(
    carOnSaltAuctions: ICarOnSaleAuction[],
  ): number {
    return +carOnSaltAuctions
      .filter(auction => auction.numBids)
      .reduce(
        (previous, currentValue) =>
          previous + +currentValue.numBids / carOnSaltAuctions.length,
        0,
      )
      .toFixed(2);
  }

  private static calculateAveragePercentageOdAuctionProgress(
    carOnSaltAuctions: ICarOnSaleAuction[],
  ): number {
    return +carOnSaltAuctions
      .filter(
        auction => auction.currentHighestBidValue && auction.minimumRequiredAsk,
      )
      .reduce((previousValue, currentValue) => {
        const { currentHighestBidValue, minimumRequiredAsk } = currentValue;
        let percentageAuctionProgress =
          (currentHighestBidValue / minimumRequiredAsk) * 100;
        return (
          previousValue + +percentageAuctionProgress / carOnSaltAuctions.length
        );
      }, 0)
      .toFixed(2);
  }
}
