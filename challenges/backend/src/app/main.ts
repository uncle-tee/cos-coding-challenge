import { Container } from 'inversify';

import { AuctionMonitorApp } from './AuctionMonitorApp';
import { DependencyIdentifier } from './DependencyIdentifiers';
import { Logger } from './services/Logger/classes/Logger';
import { ILogger } from './services/Logger/interface/ILogger';
import { CarOnSaleClient } from './services/CarOnSaleClient/classes/CarOnSaleClient';
import { ICarOnSaleClient } from './services/CarOnSaleClient/interface/ICarOnSaleClient';
import { CarOnSaleAuctionProcessor } from './services/AuctionProcessor/classes/CarOnSaleAuctionProcessor';
import { ICarOnSaleAuctionProcessor } from './services/AuctionProcessor/interface/ICarOnSaleAuctionProcessor';

/*
 * Create the DI container.
 */
const container = new Container({
  defaultScope: 'Singleton',
  skipBaseClassChecks: true,
});

/*
 * Register dependencies in DI environment.
 */
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);
container.bind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT).to(CarOnSaleClient);
container.bind<ICarOnSaleAuctionProcessor>(DependencyIdentifier.AUCTION_SERVICE).to(CarOnSaleAuctionProcessor);

/*
 * Inject all dependencies in the application & retrieve application instance.
 */
const app = container.resolve(AuctionMonitorApp);

/*
 * Start the application
 */
(async () => {
  await app.start();
})();
