import { expect } from 'chai';
import sinon from 'sinon';
import { CarOnSaleAuctionProcessor } from './CarOnSaleAuctionProcessor';
import { ICarOnSaleClient } from '../interface/ICarOnSaleClient';
import { ILogger } from '../../Logger/interface/ILogger';
import { CarOnSaleClient } from './CarOnSaleClient';
import { Logger } from '../../Logger/classes/Logger';
import {
  CarOnSaleException,
  ErrorMessage,
} from '../exeptions/CarOnSaleException';
import { afterEach } from 'mocha';
import { ICarOnSaleAuction } from '../interface/ICarOnSaleAuction';

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
      const expectedAverageNumberOfBids = 10;
      const expectedAveragePercentageOfAuctionProgress = 6;
      const expectedNumberOfAuctions = 5;

      const mockAuctions: ICarOnSaleAuction[] = [
        {
          currentHighestBidValue: 0,
          id: 0,
          label: '',
          minimumRequiredAsk: 0,
          numBids: 0,
        },
      ];

      mockCarOnSaleClient.getRunningAuctions.resolves(mockAuctions);

      const result = await auctionProcessor.processor();

      expect(result.averageNumberOfBids).to.equal(expectedAverageNumberOfBids);
      expect(result.averagePercentageOfAuctionProgress).to.equal(
        expectedAveragePercentageOfAuctionProgress,
      );
      expect(result.numberOfAuctions).to.equal(expectedNumberOfAuctions);
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
