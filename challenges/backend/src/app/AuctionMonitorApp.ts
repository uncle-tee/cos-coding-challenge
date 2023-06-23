import { inject, injectable } from 'inversify';

import { DependencyIdentifier } from './DependencyIdentifiers';
import { ILogger } from './services/Logger/interface/ILogger';
import 'reflect-metadata';
import { ICarOnSaleAuctionProcessor } from './services/CarOnSaleClient/interface/ICarOnSaleAuctionProcessor';
import * as Process from 'process';

@injectable()
export class AuctionMonitorApp {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
    @inject(DependencyIdentifier.AUCTION_SERVICE)
    private auctionCalculatorService: ICarOnSaleAuctionProcessor,
  ) {}

  public async start(): Promise<void> {
    this.logger.log(`Auction Monitor started.`);

    try {
      let auctionCalculatorResult =
        await this.auctionCalculatorService.processor();
      this.logger.log(
        `ACTIONS TOTAL BIDS RESULT ${auctionCalculatorResult.numberOfAuctions}`,
      );
      Process.exit(0);
    } catch (e) {
      this.logger.error("Failed to process auctions")
      Process.exit(-1);
    }

    // TODO: Retrieve auctions and display aggregated information (see README.md)
  }
}
