import { expect } from 'chai';
import sinon, { stub } from 'sinon';

import nock from 'nock';
import { CarOnSaleClient } from './CarOnSaleClient';
import { ILogger } from '../../Logger/interface/ILogger';
import { Logger } from '../../Logger/classes/Logger';
import { ICarOnSaleAuction } from '../interface/ICarOnSaleAuction';
import {
  CarOnSaleException,
  ErrorMessage,
} from '../exeptions/CarOnSaleException';
import config from 'config';

describe('CarOnSaleClient', () => {
  let mockLogger: sinon.SinonStubbedInstance<ILogger>;
  let carOnSaleClient: CarOnSaleClient;

  beforeEach(() => {
    mockLogger = sinon.createStubInstance<ILogger>(Logger);
    carOnSaleClient = new CarOnSaleClient(mockLogger);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('getRunningAuctions', () => {
    it('should return running auctions when authentication is successful', async () => {
      const auctions: ICarOnSaleAuction[] = [
        {
          currentHighestBidValue: 0,
          id: 0,
          label: '',
          minimumRequiredAsk: 0,
          numBids: 0,
        },
      ];

      nock('https://api-core-dev.caronsale.de/api', {
        reqheaders: {
          authtoken: 'mocked-token',
          userid: 'mocked-user-id',
          'User-Agent': 'proxy',
        },
      })
        .get('/v2/auction/buyer')
        .reply(200, auctions);

      carOnSaleClient['authCredentials'] = {
        token: 'mocked-token',
        userId: 'mocked-user-id',
      };

      const result = await carOnSaleClient.getRunningAuctions();

      expect(result).to.deep.equal(auctions);
      expect(mockLogger.error.notCalled).to.be.true;
    });

    it('should throw an error when the requests to get auctions fails', async () => {
      nock('https://api-core-dev.caronsale.de/api', {
        reqheaders: {
          authtoken: 'mocked-token',
          userid: 'mocked-user-id',
          'User-Agent': 'proxy',
        },
      })
        .get('/v2/auction/buyer')
        .reply(401, { status: 401, message: 'Request Failed' });

      carOnSaleClient['authCredentials'] = {
        token: 'mocked-token',
        userId: 'mocked-user-id',
      };

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
    carOnSaleClient['authCredentials'] = null;

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
        .reply(401, {message: "auth_failed"});

      const configGetStub = stub(config, 'get');
      configGetStub.withArgs('api.carOnSale').returns({ email, password });

      carOnSaleClient['authCredentials'] = null;

      try {
        await carOnSaleClient['authenticate']();
        expect.fail('Expected CarOnSaleException to be thrown.');
      } catch (error) {
        expect(mockLogger.error.calledOnceWith('Failed to authenticate', {
          statusCode:401,
          message: 'auth_failed',
        })).to.be.true;
        expect(error).to.be.an.instanceOf(CarOnSaleException);
        expect(error.message).to.equal(ErrorMessage.AUTHENTICATION);
      }

      configGetStub.restore();
    });

    it('should not authenticate when credentials are already present', async () => {
      carOnSaleClient['authCredentials'] = { token: 'mocked-token', userId: 'mocked-user-id' };

      await carOnSaleClient['authenticate']();

      expect(mockLogger.error.notCalled).to.be.true;
    });
  });
});
