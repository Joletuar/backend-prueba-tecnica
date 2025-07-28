import yahooFinance from 'yahoo-finance2';

import { YahooFinanceProvider } from '../../../../../src/modules/stock-analyst/infrastructure/infrastructure/external-data/yahoo-finance.provider';

jest.mock('yahoo-finance2', () => ({
  quote: jest.fn(),
}));

const mockYahooFinance = yahooFinance as jest.Mocked<typeof yahooFinance>;

describe('YahooFinanceProvider', () => {
  let provider: YahooFinanceProvider;

  beforeEach(() => {
    provider = new YahooFinanceProvider();
    jest.clearAllMocks();
  });

  describe('#getCurrentPrice', () => {
    it('should return stock price data when API call succeeds', async () => {
      // Arrange
      const mockQuote = {
        regularMarketPrice: 150.5,
        currency: 'USD',
      };
      mockYahooFinance.quote.mockResolvedValue(mockQuote as any);

      // Act
      const result = await provider.getCurrentPrice('AAPL');

      // Assert
      expect(result).toEqual({
        ticker: 'AAPL',
        currentPrice: 150.5,
        currency: 'USD',
      });
      expect(mockYahooFinance.quote).toHaveBeenCalledWith('AAPL');
    });

    it('should return null when regularMarketPrice is not available', async () => {
      // Arrange
      const mockQuote = {
        regularMarketPrice: null,
        currency: 'USD',
      };
      mockYahooFinance.quote.mockResolvedValue(mockQuote as any);

      // Act
      const result = await provider.getCurrentPrice('INVALID');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when API call fails', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockYahooFinance.quote.mockRejectedValue(new Error('API Error'));

      // Act
      const result = await provider.getCurrentPrice('AAPL');

      // Assert
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching price for AAPL:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });

    it('should use USD as default currency when currency is not provided', async () => {
      // Arrange
      const mockQuote = {
        regularMarketPrice: 160.25,
        currency: undefined,
      };
      mockYahooFinance.quote.mockResolvedValue(mockQuote as any);

      // Act
      const result = await provider.getCurrentPrice('NVDA');

      // Assert
      expect(result).toEqual({
        ticker: 'NVDA',
        currentPrice: 160.25,
        currency: 'USD',
      });
    });
  });

  describe('#getBatchCurrentPrices', () => {
    beforeEach(() => {
      jest.spyOn(global, 'setTimeout').mockImplementation((fn) => {
        fn();
        return {} as NodeJS.Timeout;
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return prices for all successful ticker requests', async () => {
      // Arrange
      const mockQuotes = [
        { regularMarketPrice: 150.5, currency: 'USD' },
        { regularMarketPrice: 280.75, currency: 'USD' },
        { regularMarketPrice: 160.25, currency: 'USD' },
      ];

      mockYahooFinance.quote
        .mockResolvedValueOnce(mockQuotes[0] as any)
        .mockResolvedValueOnce(mockQuotes[1] as any)
        .mockResolvedValueOnce(mockQuotes[2] as any);

      // Act
      const result = await provider.getBatchCurrentPrices([
        'AAPL',
        'TSLA',
        'NVDA',
      ]);

      // Assert
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { ticker: 'AAPL', currentPrice: 150.5, currency: 'USD' },
        { ticker: 'TSLA', currentPrice: 280.75, currency: 'USD' },
        { ticker: 'NVDA', currentPrice: 160.25, currency: 'USD' },
      ]);
    });

    it('should handle mixed success and failure requests', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      mockYahooFinance.quote
        .mockResolvedValueOnce({
          regularMarketPrice: 150.5,
          currency: 'USD',
        } as any)
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({
          regularMarketPrice: 160.25,
          currency: 'USD',
        } as any);

      // Act
      const result = await provider.getBatchCurrentPrices([
        'AAPL',
        'INVALID',
        'NVDA',
      ]);

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { ticker: 'AAPL', currentPrice: 150.5, currency: 'USD' },
        { ticker: 'NVDA', currentPrice: 160.25, currency: 'USD' },
      ]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch price for INVALID'
      );

      consoleSpy.mockRestore();
    });

    it('should handle empty ticker array', async () => {
      // Act
      const result = await provider.getBatchCurrentPrices([]);

      // Assert
      expect(result).toHaveLength(0);
      expect(mockYahooFinance.quote).not.toHaveBeenCalled();
    });

    it('should handle all requests failing', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      mockYahooFinance.quote
        .mockRejectedValueOnce(new Error('API Error 1'))
        .mockRejectedValueOnce(new Error('API Error 2'));

      // Act
      const result = await provider.getBatchCurrentPrices([
        'INVALID1',
        'INVALID2',
      ]);

      // Assert
      expect(result).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalledTimes(2);

      consoleSpy.mockRestore();
    });

    it('should add delays between requests', async () => {
      // Arrange
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      mockYahooFinance.quote.mockResolvedValue({
        regularMarketPrice: 150.5,
        currency: 'USD',
      } as any);

      // Act
      await provider.getBatchCurrentPrices(['AAPL', 'TSLA', 'NVDA']);

      expect(setTimeoutSpy).toHaveBeenCalledTimes(3);
      expect(setTimeoutSpy).toHaveBeenNthCalledWith(1, expect.any(Function), 0);
      expect(setTimeoutSpy).toHaveBeenNthCalledWith(
        2,
        expect.any(Function),
        100
      );
      expect(setTimeoutSpy).toHaveBeenNthCalledWith(
        3,
        expect.any(Function),
        200
      );
    });
  });
});
