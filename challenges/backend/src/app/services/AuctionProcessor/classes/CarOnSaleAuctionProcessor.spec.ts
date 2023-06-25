import { expect } from 'chai';
import sinon from 'sinon';
import { CarOnSaleAuctionProcessor } from './CarOnSaleAuctionProcessor';
import { ICarOnSaleClient } from '../../CarOnSaleClient/interface/ICarOnSaleClient';
import { ILogger } from '../../Logger/interface/ILogger';
import { CarOnSaleClient } from '../../CarOnSaleClient/classes/CarOnSaleClient';
import { Logger } from '../../Logger/classes/Logger';
import {
  CarOnSaleException,
  ErrorMessage,
} from '../../CarOnSaleClient/exeptions/CarOnSaleException';
import { afterEach } from 'mocha';
import { ICarOnSaleAuction } from '../../CarOnSaleClient/interface/ICarOnSaleAuction';

describe('CarOnSaleAuctionProcessor', () => {
  let auctionProcessor: CarOnSaleAuctionProcessor;
  let mockCarOnSaleClient: sinon.SinonStubbedInstance<ICarOnSaleClient>;
  let mockLogger: sinon.SinonStubbedInstance<ILogger>;

  beforeEach(() => {
    mockCarOnSaleClient =
      sinon.createStubInstance<ICarOnSaleClient>(CarOnSaleClient);
    mockLogger = sinon.createStubInstance<ILogger>(Logger);
    auctionProcessor = new CarOnSaleAuctionProcessor(
      mockCarOnSaleClient as unknown as ICarOnSaleClient,
      mockLogger as unknown as ILogger,
    );
  });

  afterEach(() => {
    mockLogger.error.reset();
    mockLogger.log.reset();
    mockCarOnSaleClient.getRunningAuctions.reset();
  });

  describe('processor', () => {
    it('should return the correct auction processor result', async () => {
      const expectedAveragePercentageOfAuctionProgress = 6;

      const mockAuctions: ICarOnSaleAuction[] = [
        {
          currentHighestBidValue: 10,
          minimumRequiredAsk: 15,
          numBids: 10,
        },
        {
          currentHighestBidValue: 36,
          minimumRequiredAsk: 35,
          numBids: 15,
        },
      ];

      mockCarOnSaleClient.getRunningAuctions.resolves(mockAuctions);

      const result = await auctionProcessor.processor();

      expect(result.averageNumberOfBids).to.equal(12.5);
      expect(result.averagePercentageOfAuctionProgress).to.equal(84.76);
      expect(result.numberOfAuctions).to.equal(2);
      sinon.assert.calledOnce(mockCarOnSaleClient.getRunningAuctions);
    });

    it('should throw the same error thrown in #CarOnSaleClient.getRunningAuctions', async () => {
      const error = new CarOnSaleException(ErrorMessage.AUTHENTICATION);
      mockCarOnSaleClient.getRunningAuctions.throws(error);

      try {
        await auctionProcessor.processor();
      } catch (e) {
        sinon.assert.calledOnce(mockLogger.error);
        expect(
          mockLogger.error.calledOnceWith(ErrorMessage.AUTHENTICATION),
        ).to.equal(true);
        expect(e).to.to.an.instanceof(CarOnSaleException);
      }
    });
  });
});
