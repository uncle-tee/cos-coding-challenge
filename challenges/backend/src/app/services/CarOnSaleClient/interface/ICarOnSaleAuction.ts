/**
 * This is a model for the available auctions on car on Sale platform
 */
export interface ICarOnSaleAuction {
  minimumRequiredAsk: number;
  currentHighestBidValue: number;
  numBids: number;
}

export interface ICarOnSaleRunningActionResponse {
  items: ICarOnSaleAuction[];
  page: number;
  total: number;
}
