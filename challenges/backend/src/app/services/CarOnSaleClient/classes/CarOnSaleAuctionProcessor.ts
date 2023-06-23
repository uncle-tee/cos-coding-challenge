import 'reflect-metadata';
import { ICarOnSaleAuctionProcessorResult } from '../interface/ICarOnSaleAuctionProcessorResult';
import { inject, injectable } from 'inversify';
import { DependencyIdentifier } from '../../../DependencyIdentifiers';
import { ICarOnSaleClient } from '../interface/ICarOnSaleClient';
import { ICarOnSaleAuctionProcessor } from '../interface/ICarOnSaleAuctionProcessor';
import { ICarOnSaleAuction } from '../interface/ICarOnSaleAuction';
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
        numberOfAuctions: 5,
      };
    } catch (e) {
      this.logger.error(e.message);
      throw e;
    }
  }

  private static calculateAverageNumberOfBids(
    carOnSaltAuctions: ICarOnSaleAuction[],
  ): number {
    return 10;
  }

  private static calculateAveragePercentageOdAuctionProgress(
    carOnSaltAuctions: ICarOnSaleAuction[],
  ): number {
    return 6;
  }
}
