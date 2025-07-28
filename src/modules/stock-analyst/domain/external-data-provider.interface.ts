export interface StockPriceData {
  ticker: string;
  currentPrice: number;
  currency: string;
}

export interface ExternalDataProvider {
  getCurrentPrice(ticker: string): Promise<StockPriceData | null>;
  getBatchCurrentPrices(tickers: string[]): Promise<StockPriceData[]>;
}
