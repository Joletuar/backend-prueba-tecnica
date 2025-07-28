import type {
  ExternalDataProvider,
  StockPriceData,
} from '../../../../../src/modules/stock-analyst/domain/external-data-provider.interface';

export class MockExternalDataProvider implements ExternalDataProvider {
  private priceData: Map<string, StockPriceData> = new Map();

  async getCurrentPrice(ticker: string): Promise<StockPriceData | null> {
    return this.priceData.get(ticker) || null;
  }

  async getBatchCurrentPrices(tickers: string[]): Promise<StockPriceData[]> {
    const prices: StockPriceData[] = [];

    for (const ticker of tickers) {
      const price = this.priceData.get(ticker);
      if (price) {
        prices.push(price);
      }
    }

    return prices;
  }
}
