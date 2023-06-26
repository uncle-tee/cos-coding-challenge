/**
 * This is a model for the available auctions on car on Sale platform
 */
export interface ICarOnSaleAuction {
  minimumRequiredAsk: number;
  currentHighestBidValue: number;
  numBids: number;
}

export interface ICarOnSaleRunningAuctionResponse {
  items: ICarOnSaleAuction[];
  page: number;
  total: number;
}


export interface ICarOnSaleAuthenticationRequest {
  email: string;
  password: string;
}
