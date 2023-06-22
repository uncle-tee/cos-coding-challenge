import { Container } from 'inversify';

import { AuctionMonitorApp } from './AuctionMonitorApp';
import { DependencyIdentifier } from './DependencyIdentifiers';
import { Logger } from './services/Logger/classes/Logger';
import { ILogger } from './services/Logger/interface/ILogger';

/*
 * Create the DI container.
 */
const container = new Container({
  defaultScope: 'Singleton',
});

/*
 * Register dependencies in DI environment.
 */
container.bind<ILogger>(DependencyIdentifier.LOGGER).to(Logger);

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
