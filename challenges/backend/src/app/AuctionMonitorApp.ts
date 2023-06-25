import { inject, injectable } from 'inversify';

import { DependencyIdentifier } from './DependencyIdentifiers';
import { ILogger } from './services/Logger/interface/ILogger';
import 'reflect-metadata';
import { ICarOnSaleAuctionProcessor } from './services/AuctionProcessor/interface/ICarOnSaleAuctionProcessor';
import * as Process from 'process';

@injectable()
export class AuctionMonitorApp {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
    @inject(DependencyIdentifier.AUCTION_SERVICE)
    private auctionCalculatorService: ICarOnSaleAuctionProcessor,
  ) {}

  public async start(): Promise<void> {
    this.logger.log(`Starting Auction Monitor`);

    try {
      let auctionCalculatorResult = await this.auctionCalculatorService.summarizeAuctions();
      this.logger.log(`ACTIONS TOTAL BIDS RESULT ${auctionCalculatorResult.numberOfAuctions}`);
      this.logger.log(`AVERAGE NUMBER OF BIDS ${auctionCalculatorResult.averageNumberOfBids}`);
      this.logger.log(
        `AVERAGE PERCENTAGE OF THE AUCTION PROGRESS ${auctionCalculatorResult.averagePercentageOfAuctionProgress}`,
      );

      this.logger.log('Auction Monitor Ended');

      Process.exit(0);
    } catch (e) {
      this.logger.error('Failed to process auctions');
      Process.exit(-1);
    }
  }
}
