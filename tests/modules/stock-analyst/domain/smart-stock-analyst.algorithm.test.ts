import type { StockPriceData } from '../../../../src/modules/stock-analyst/domain/external-data-provider.interface';
import { SmartStockAnalystAlgorithm } from '../../../../src/modules/stock-analyst/domain/smart-stock-analyst.algorithm';
import { StockMother } from '../../../modules/stock/application/helpers/stock.mother';

describe('SmartStockAnalystAlgorithm', () => {
  let algorithm: SmartStockAnalystAlgorithm;

  beforeEach(() => {
    algorithm = new SmartStockAnalystAlgorithm();
  });

  describe('#calculateScore', () => {
    it('should calculate score with upgrade rating and price data', () => {
      // Arrange
      const stock = StockMother.nvidia({
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
        targetFrom: 150,
        targetTo: 200,
        action: 'upgrade',
      });

      const priceData: StockPriceData = {
        currentPrice: 160,
        currency: 'USD',
        ticker: 'NVDA',
      };

      // Act
      const score = algorithm.calculateScore(stock, priceData);

      // Assert
      expect(score).toBeGreaterThan(0);
      expect(typeof score).toBe('number');
    });

    it('should give higher score for strong buy vs buy rating', () => {
      // Arrange
      const stockBuy = StockMother.nvidia({
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
        targetFrom: 150,
        targetTo: 200,
        action: 'upgrade',
      });

      const stockStrongBuy = StockMother.nvidia({
        ratingFrom: 'Hold',
        ratingTo: 'Strong Buy',
        targetFrom: 150,
        targetTo: 200,
        action: 'upgrade',
      });

      const priceData: StockPriceData = {
        currentPrice: 160,
        currency: 'USD',
        ticker: 'NVDA',
      };

      // Act
      const scoreBuy = algorithm.calculateScore(stockBuy, priceData);
      const scoreStrongBuy = algorithm.calculateScore(
        stockStrongBuy,
        priceData
      );

      // Assert
      expect(scoreStrongBuy).toBeGreaterThan(scoreBuy);
    });

    it('should calculate score without price data', () => {
      // Arrange
      const stock = StockMother.nvidia({
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
        targetFrom: 150,
        targetTo: 200,
        action: 'upgrade',
      });

      // Act
      const score = algorithm.calculateScore(stock, null);

      // Assert
      expect(score).toBeGreaterThan(0);
      expect(typeof score).toBe('number');
    });

    it('should give higher score for upgrade vs downgrade action', () => {
      // Arrange
      const stockUpgrade = StockMother.nvidia({
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
        targetFrom: 150,
        targetTo: 200,
        action: 'upgrade',
      });

      const stockDowngrade = StockMother.nvidia({
        ratingFrom: 'Buy',
        ratingTo: 'Hold',
        targetFrom: 200,
        targetTo: 150,
        action: 'downgrade',
      });

      const priceData: StockPriceData = {
        currentPrice: 160,
        currency: 'USD',
        ticker: 'NVDA',
      };

      // Act
      const scoreUpgrade = algorithm.calculateScore(stockUpgrade, priceData);
      const scoreDowngrade = algorithm.calculateScore(
        stockDowngrade,
        priceData
      );

      // Assert
      expect(scoreUpgrade).toBeGreaterThan(scoreDowngrade);
    });

    it('should give bonus for recent analysis', () => {
      // Arrange
      const recentStock = StockMother.nvidia({
        time: new Date(), // Today
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
      });

      const oldStock = StockMother.nvidia({
        time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
      });

      const priceData: StockPriceData = {
        currentPrice: 160,
        currency: 'USD',
        ticker: 'NVDA',
      };

      // Act
      const recentScore = algorithm.calculateScore(recentStock, priceData);
      const oldScore = algorithm.calculateScore(oldStock, priceData);

      // Assert
      expect(recentScore).toBeGreaterThan(oldScore);
    });

    it('should give bonus for high-value stocks', () => {
      // Arrange
      const highValueStock = StockMother.nvidia({
        targetTo: 500,
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
      });

      const lowValueStock = StockMother.nvidia({
        targetTo: 50,
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
      });

      const priceData: StockPriceData = {
        currentPrice: 160,
        currency: 'USD',
        ticker: 'NVDA',
      };

      // Act
      const highValueScore = algorithm.calculateScore(
        highValueStock,
        priceData
      );
      const lowValueScore = algorithm.calculateScore(lowValueStock, priceData);

      // Assert
      expect(highValueScore).toBeGreaterThan(lowValueScore);
    });
  });

  describe('#generateReason', () => {
    it('should generate reason for rating upgrade', () => {
      // Arrange
      const stock = StockMother.nvidia({
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
        targetFrom: 150,
        targetTo: 200,
        action: 'upgrade',
        brokerage: 'Goldman Sachs',
      });

      const priceData: StockPriceData = {
        currentPrice: 160,
        currency: 'USD',
        ticker: 'NVDA',
      };

      // Act
      const reason = algorithm.generateReason(stock, priceData);

      // Assert
      expect(reason).toContain('Goldman Sachs');
      expect(reason).toContain('ha mejorado su rating');
      expect(reason).toContain('Hold');
      expect(reason).toContain('Buy');
      expect(reason).toContain('potencial de crecimiento');
      expect(reason).toContain('recomendado');
    });

    it('should generate reason for rating downgrade', () => {
      // Arrange
      const stock = StockMother.nvidia({
        ratingFrom: 'Buy',
        ratingTo: 'Hold',
        targetFrom: 200,
        targetTo: 150,
        action: 'downgrade',
        brokerage: 'Morgan Stanley',
      });

      const priceData: StockPriceData = {
        currentPrice: 160,
        currency: 'USD',
        ticker: 'NVDA',
      };

      // Act
      const reason = algorithm.generateReason(stock, priceData);

      // Assert
      expect(reason).toContain('Morgan Stanley');
      expect(reason).toContain('ha reducido su rating');
      expect(reason).toContain('Buy');
      expect(reason).toContain('Hold');
    });

    it('should generate reason for maintained rating', () => {
      // Arrange
      const stock = StockMother.nvidia({
        ratingFrom: 'Buy',
        ratingTo: 'Buy',
        targetFrom: 180,
        targetTo: 200,
        action: 'maintain',
        brokerage: 'JP Morgan',
      });

      const priceData: StockPriceData = {
        currentPrice: 160,
        currency: 'USD',
        ticker: 'NVDA',
      };

      // Act
      const reason = algorithm.generateReason(stock, priceData);

      // Assert
      expect(reason).toContain('JP Morgan');
      expect(reason).toContain('mantiene su rating Buy');
    });

    it('should generate reason without price data', () => {
      // Arrange
      const stock = StockMother.nvidia({
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
        targetFrom: 150,
        targetTo: 200,
        action: 'upgrade',
        brokerage: 'Goldman Sachs',
      });

      // Act
      const reason = algorithm.generateReason(stock, null);

      // Assert
      expect(reason).toContain('Goldman Sachs');
      expect(reason).toContain('El precio objetivo ha aumentado');
      expect(reason).toContain('$150');
      expect(reason).toContain('$200');
    });

    it('should include recency information for recent analysis', () => {
      // Arrange
      const stock = StockMother.nvidia({
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
        time: new Date(), // Today
        brokerage: 'Goldman Sachs',
      });

      const priceData: StockPriceData = {
        currentPrice: 160,
        currency: 'USD',
        ticker: 'NVDA',
      };

      // Act
      const reason = algorithm.generateReason(stock, priceData);

      // Assert
      expect(reason).toContain('Este análisis es muy reciente');
    });

    it('should include action description', () => {
      // Arrange
      const stock = StockMother.nvidia({
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
        action: 'initiate',
        brokerage: 'Goldman Sachs',
      });

      const priceData: StockPriceData = {
        currentPrice: 160,
        currency: 'USD',
        ticker: 'NVDA',
      };

      // Act
      const reason = algorithm.generateReason(stock, priceData);

      // Assert
      expect(reason).toContain('El analista ha iniciado cobertura');
    });
  });

  describe('#createAnalysis', () => {
    it('should create complete stock analysis with price data', () => {
      // Arrange
      const stock = StockMother.nvidia({
        id: 'stock-123',
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
        targetFrom: 150,
        targetTo: 200,
        action: 'upgrade',
        brokerage: 'Goldman Sachs',
      });

      const priceData: StockPriceData = {
        currentPrice: 160,
        currency: 'USD',
        ticker: 'NVDA',
      };

      // Act
      const analysis = algorithm.createAnalysis(stock, priceData);

      // Assert
      expect(analysis).toHaveProperty('id');
      expect(analysis.id).toBeTruthy();
      expect(analysis.stockId).toBe('stock-123');
      expect(analysis.currentPrice).toBe(160);
      expect(analysis.potentialGrowth).toBe(25); // (200-160)/160 * 100
      expect(analysis.score).toBeGreaterThan(0);
      expect(analysis.reason).toContain('recomendado');
    });

    it('should create analysis without price data', () => {
      // Arrange
      const stock = StockMother.nvidia({
        id: 'stock-456',
        ratingFrom: 'Hold',
        ratingTo: 'Buy',
        targetFrom: 150,
        targetTo: 200,
      });

      // Act
      const analysis = algorithm.createAnalysis(stock, null);

      // Assert
      expect(analysis).toHaveProperty('id');
      expect(analysis.stockId).toBe('stock-456');
      expect(analysis.currentPrice).toBe(0);
      expect(analysis.potentialGrowth).toBe(33.3); // (200-150)/150 * 100, rounded
      expect(analysis.score).toBeGreaterThan(0);
      expect(analysis.reason).toContain('recomendado');
    });
  });
});
