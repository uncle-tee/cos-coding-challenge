import { expect } from 'chai';
import sinon, { stub } from 'sinon';

import nock from 'nock';
import { CarOnSaleClient } from './CarOnSaleClient';
import { ILogger } from '../../Logger/interface/ILogger';
import { Logger } from '../../Logger/classes/Logger';
import { ICarOnSaleRunningAuctionResponse } from '../interface/ICarOnSaleAuction';
import { CarOnSaleException, ErrorMessage } from '../exeptions/CarOnSaleException';
import config from 'config';
import { HttpClientException } from '../../NetworkClient/exceptions/HttpClientException';

describe('CarOnSaleClient', () => {
  let mockLogger: sinon.SinonStubbedInstance<ILogger>;
  let carOnSaleClient: CarOnSaleClient;
  let nockInstance;

  beforeEach(() => {
    mockLogger = sinon.createStubInstance<ILogger>(Logger);
    nockInstance = nock('https://api-core-dev.caronsale.de/api', {
      reqheaders: {
        authtoken: 'mocked-token',
        userid: 'mocked-user-id',
        'User-Agent': 'proxy',
      },
    });
    carOnSaleClient = new CarOnSaleClient(mockLogger);

    carOnSaleClient['authCredentials'] = {
      token: 'mocked-token',
      userId: 'mocked-user-id',
    };
  });

  afterEach(() => {
    nock.cleanAll();
    sinon.reset();
  });

  describe('getRunningAuctions', () => {
    it('should return running auctions when authentication is successful', async () => {
      const auctions: ICarOnSaleRunningAuctionResponse = {
        page: 1,
        total: 1,
        items: [
          {
            currentHighestBidValue: 7,
            minimumRequiredAsk: 6,
            numBids: 6,
          },
        ],
      };

      const fetchAuctionsStub = sinon.stub();
      fetchAuctionsStub.resolves(auctions);
      const authenticationStub = sinon.stub();

      carOnSaleClient.fetchAuctions = fetchAuctionsStub;
      carOnSaleClient['authenticate'] = authenticationStub;

      const result = await carOnSaleClient.getRunningAuctions();

      expect(result).to.deep.equal(auctions.items);
      expect(mockLogger.error.notCalled).to.be.true;
    });

    it('should call the fetchAuctions twice when the auctions is less than the total on the first call', async () => {
      const firstAuctionCallResult: ICarOnSaleRunningAuctionResponse = {
        page: 1,
        total: 2,
        items: [
          {
            currentHighestBidValue: 7,
            minimumRequiredAsk: 6,
            numBids: 6,
          },
        ],
      };

      const secondAuctionResult: ICarOnSaleRunningAuctionResponse = {
        page: 1,
        total: 2,
        items: [
          {
            currentHighestBidValue: 56,
            minimumRequiredAsk: 65,
            numBids: 8,
          },
        ],
      };

      const fetchAuctionsStub = sinon.stub();

      fetchAuctionsStub.onFirstCall().resolves(firstAuctionCallResult);
      fetchAuctionsStub.onSecondCall().resolves(secondAuctionResult);

      carOnSaleClient.fetchAuctions = fetchAuctionsStub;

      const result = await carOnSaleClient.getRunningAuctions();

      expect(result).to.deep.equal([...firstAuctionCallResult.items, ...secondAuctionResult.items]);
      expect(fetchAuctionsStub.callCount).to.equal(2);
      expect(fetchAuctionsStub.firstCall.calledWithExactly({ limit: 4000, offset: 0 }));
      expect(fetchAuctionsStub.secondCall.calledWithExactly({ limit: 4000, offset: 1 }));
      expect(mockLogger.error.notCalled).to.be.true;
    });

    it('should throw an error when the requests to get auctions fails', async () => {
      const fetchAuctionsStub = sinon.stub();
      fetchAuctionsStub.throws(
        new HttpClientException(401, {
          statusCode: 401,
          message: 'Request Failed',
        }),
      );
      carOnSaleClient.fetchAuctions = fetchAuctionsStub;

      try {
        await carOnSaleClient.getRunningAuctions();
      } catch (error) {
        expect(
          mockLogger.error.calledOnceWith('Fetching Auction Failed', {
            statusCode: 401,
            message: 'Request Failed',
          }),
        ).to.equal(true);

        expect(error).to.be.an.instanceOf(CarOnSaleException);
        expect(error.message).to.equal(ErrorMessage.FETCH_AUCTIONS);
      }
    });
  });

  it('should throw the error from authenticate when the authentication method throws error', async () => {
    const authenticateStub = sinon.stub();
    authenticateStub.throws(new CarOnSaleException(ErrorMessage.AUTHENTICATION));
    carOnSaleClient['authenticate'] = authenticateStub;
    try {
      await carOnSaleClient.getRunningAuctions();
    } catch (error) {
      expect(error).to.be.an.instanceOf(CarOnSaleException);
      expect(error.message).to.equal(ErrorMessage.AUTHENTICATION);
    }
  });

  describe('authenticate', () => {
    it('should authenticate and set authCredentials when credentials are not present', async () => {
      const email = 'mocked-email@example.com';
      const password = 'mocked-password';
      const authCredentials = {
        token: 'mocked-token',
        userId: 'mocked-user-id',
      };

      nock('https://api-core-dev.caronsale.de/api')
        .put(`/v1/authentication/${email}`, { password })
        .reply(200, authCredentials);

      const configGetStub = stub(config, 'get');
      configGetStub.withArgs('api.carOnSale').returns({ email, password });

      carOnSaleClient['authCredentials'] = null;

      await carOnSaleClient['authenticate']();

      expect(carOnSaleClient['authCredentials']).to.deep.equal(authCredentials);
      expect(mockLogger.error.notCalled).to.be.true;

      configGetStub.restore();
    });

    it('should throw a CarOnSaleException and log an error when authentication fails', async () => {
      const email = 'mocked-email@example.com';
      const password = 'mocked-password';

      nock('https://api-core-dev.caronsale.de/api')
        .put(`/v1/authentication/${email}`, { password })
        .reply(401, { message: 'auth_failed' });

      const configGetStub = stub(config, 'get');
      configGetStub.withArgs('api.carOnSale').returns({ email, password });

      carOnSaleClient['authCredentials'] = null;

      try {
        await carOnSaleClient['authenticate']();
        expect.fail('Expected CarOnSaleException to be thrown.');
      } catch (error) {
        expect(
          mockLogger.error.calledOnceWith('Failed to authenticate', {
            statusCode: 401,
            message: 'auth_failed',
          }),
        ).to.be.true;
        expect(error).to.be.an.instanceOf(CarOnSaleException);
        expect(error.message).to.equal(ErrorMessage.AUTHENTICATION);
      }

      configGetStub.restore();
    });

    it('should not authenticate when credentials are already present', async () => {
      carOnSaleClient['authCredentials'] = {
        token: 'mocked-token',
        userId: 'mocked-user-id',
      };

      await carOnSaleClient['authenticate']();

      expect(mockLogger.error.notCalled).to.be.true;
    });
  });

  describe('fetchAuctions', () => {
    it('should return running auctions when authentication is successful', async () => {
      const auctions: ICarOnSaleRunningAuctionResponse = {
        page: 1,
        total: 1,
        items: [
          {
            currentHighestBidValue: 7,
            minimumRequiredAsk: 6,
            numBids: 6,
          },
        ],
      };

      nockInstance
        .get('/v2/auction/buyer/')
        .query({
          filter: JSON.stringify({ limit: 4000, offset: 0 }),
        })
        .reply(200, auctions);

      carOnSaleClient['authCredentials'] = {
        token: 'mocked-token',
        userId: 'mocked-user-id',
      };

      const result = await carOnSaleClient.getRunningAuctions();

      expect(result).to.deep.equal(auctions.items);
      expect(mockLogger.error.notCalled).to.be.true;
    });

    it('should throw an error when the requests to get auctions fails', async () => {
      nockInstance
        .get('/v2/auction/buyer/')
        .query({
          filter: JSON.stringify({ limit: 4000, offset: 0 }),
        })
        .reply(401, { status: 401, message: 'Request Failed' });

      carOnSaleClient['authCredentials'] = {
        token: 'mocked-token',
        userId: 'mocked-user-id',
      };

      try {
        await carOnSaleClient.fetchAuctions({ limit: 4000, offset: 0 });
      } catch (error) {
        expect(error).to.be.an.instanceOf(HttpClientException);
      }
    });
  });
});
