export interface ICarOnSaleAuctionProcessorResult {
  /**
   * This is the total number of auctions
   */
  numberOfAuctions: number;

  /**
   * This is the total sum of available bids/number of available bids
   */
  averageNumberOfBids: number;

  /**
   * This is the ratio of current highest bid value and minimum required ask
   *
   * @return number
   */
  averagePercentageOfAuctionProgress: number;
}
