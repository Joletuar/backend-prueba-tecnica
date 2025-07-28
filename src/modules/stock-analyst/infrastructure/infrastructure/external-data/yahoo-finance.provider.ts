import yahooFinance from 'yahoo-finance2';

import type {
  ExternalDataProvider,
  StockPriceData,
} from '../../../domain/external-data-provider.interface';

export class YahooFinanceProvider implements ExternalDataProvider {
  async getCurrentPrice(ticker: string): Promise<StockPriceData | null> {
    try {
      const quote = await yahooFinance.quote(ticker);

      if (!quote.regularMarketPrice) return null;

      console.log(
        `Fetched price for ${ticker}: ${quote.regularMarketPrice} ${quote.currency}`
      );

      return {
        ticker,
        currentPrice: quote.regularMarketPrice,
        currency: quote.currency || 'USD',
      };
    } catch (error) {
      console.error(`Error fetching price for ${ticker}:`, error);

      return null;
    }
  }

  async getBatchCurrentPrices(tickers: string[]): Promise<StockPriceData[]> {
    const prices: StockPriceData[] = [];

    const promises = tickers.map(async (ticker, index) => {
      await new Promise((resolve) => setTimeout(resolve, index * 100));

      return this.getCurrentPrice(ticker);
    });

    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        prices.push(result.value);
      }

      console.warn(`Failed to fetch price for ${tickers[index]}`);
    });

    return prices;
  }
}
