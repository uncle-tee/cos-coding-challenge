/**
 * This is a model for the available auctions on car on Sale platform
 */
export interface ICarOnSaleAuction {
  id: number;
  label: string;
  minimumRequiredAsk: number;
  currentHighestBidValue: number;
  numBids: number;
}
