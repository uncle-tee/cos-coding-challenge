import { inject, injectable } from 'inversify';

import { DependencyIdentifier } from './DependencyIdentifiers';
import { ILogger } from './services/Logger/interface/ILogger';
import 'reflect-metadata';

@injectable()
export class AuctionMonitorApp {
  public constructor(
    @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
  ) {}

  public async start(): Promise<void> {
    this.logger.log(`Auction Monitor started.`);

    // TODO: Retrieve auctions and display aggregated information (see README.md)
  }
}
