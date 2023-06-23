export class CarOnSaleException extends Error {
  constructor(message: ErrorMessage) {
    super(message);
  }
}

export enum ErrorMessage {
  AUTHENTICATION = 'CAR_ON_SALE_AUTHENTICATION_ERROR',
  FETCH_AUCTIONS = 'CAR_ON_SALE_FETCH_AUCTION_FAILED',
}
