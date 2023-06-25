import { expect } from 'chai';
import sinon from 'sinon';
import { CarOnSaleAuctionProcessor } from './CarOnSaleAuctionProcessor';
import { ICarOnSaleClient } from '../../CarOnSaleClient/interface/ICarOnSaleClient';
import { ILogger } from '../../Logger/interface/ILogger';
import { CarOnSaleClient } from '../../CarOnSaleClient/classes/CarOnSaleClient';
import { Logger } from '../../Logger/classes/Logger';
import { CarOnSaleException, ErrorMessage } from '../../CarOnSaleClient/exeptions/CarOnSaleException';
import { afterEach } from 'mocha';
import { ICarOnSaleAuction } from '../../CarOnSaleClient/interface/ICarOnSaleAuction';

describe('CarOnSaleAuctionProcessor', () => {
  let auctionProcessor: CarOnSaleAuctionProcessor;
  let mockCarOnSaleClient: sinon.SinonStubbedInstance<ICarOnSaleClient>;
  let mockLogger: sinon.SinonStubbedInstance<ILogger>;
  let mockAuctions: ICarOnSaleAuction[];

  beforeEach(() => {
    mockCarOnSaleClient =
      sinon.createStubInstance<ICarOnSaleClient>(CarOnSaleClient);
    mockLogger = sinon.createStubInstance<ILogger>(Logger);
    mockAuctions = [
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
    ]
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

  describe('CarOnSaleAuctionProcessor', () => {
    describe('summarizeAuctions', () => {
      it('should return the correct auction processor result', async () => {
        mockCarOnSaleClient.getRunningAuctions.resolves(mockAuctions);

        const result = await auctionProcessor.summarizeAuctions();

        expect(result.averageNumberOfBids).to.equal(12.5);
        expect(result.averagePercentageOfAuctionProgress).to.equal(84.76);
        expect(result.numberOfAuctions).to.equal(2);
        sinon.assert.calledOnce(mockCarOnSaleClient.getRunningAuctions);
      });

      it('should throw the same error thrown in #CarOnSaleClient.getRunningAuctions', async () => {
        const error = new CarOnSaleException(ErrorMessage.AUTHENTICATION);
        mockCarOnSaleClient.getRunningAuctions.throws(error);

        try {
          await auctionProcessor.summarizeAuctions();
        } catch (e) {
          sinon.assert.calledOnce(mockLogger.error);
          expect(
            mockLogger.error.calledOnceWith(ErrorMessage.AUTHENTICATION),
          ).to.equal(true);
          expect(e).to.to.an.instanceof(CarOnSaleException);
        }
      });
    });

    describe('calculateAverageNumberOfBids', () => {
      it('calculates the average number of bids correctly', () => {
        const result =
          auctionProcessor.calculateAverageNumberOfBids(mockAuctions);
        expect(result).to.equal(12.5);
      });
    });

    describe('calculateAveragePercentageOfAuctionProgress', () => {
      it('calculates the average percentage of auction progress correctly', () => {
        const result =
          auctionProcessor.calculateAveragePercentageOfAuctionProgress(
            mockAuctions,
          );
        expect(result).to.equal(84.76);
      });
    });
  });
});
