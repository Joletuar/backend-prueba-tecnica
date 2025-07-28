import { NotFoundError } from '../../../../../src/modules/shared/domain/errors/not-found.error';
import { GetBestRecommendation } from '../../../../../src/modules/stock-analyst/application/get-best-recommendation/get-best-recommendation.use-case';
import type { StockAnalystRepository } from '../../../../../src/modules/stock-analyst/domain/stock-analyst.repository';
import { createStockAnalystRepositoryMock } from '../__mocks__/stock-analyst-repository.mock';
import { StockAnalystMother } from '../helpers/stock-analyst.mother';

describe('GetBestRecommendation', () => {
  let useCase: GetBestRecommendation;
  let repository: jest.Mocked<StockAnalystRepository>;

  beforeEach(() => {
    repository = createStockAnalystRepositoryMock();

    useCase = new GetBestRecommendation(repository);
  });

  describe('#execute', () => {
    it('should return the best stock analyst recommendation', async () => {
      // Arrange
      const bestAnalysis = StockAnalystMother.nvidia(); // Score: 85

      repository.getBestRecommendation.mockResolvedValue(bestAnalysis);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(repository.getBestRecommendation).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        id: bestAnalysis.id,
        stockId: bestAnalysis.stockId,
        currentPrice: bestAnalysis.currentPrice,
        potentialGrowth: bestAnalysis.potentialGrowth,
        score: bestAnalysis.score,
        reason: bestAnalysis.reason,
      });
    });

    it('should throw NotFoundError when no recommendation is found', async () => {
      // Arrange
      repository.getBestRecommendation.mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(NotFoundError);
      await expect(useCase.execute()).rejects.toThrow(
        'No stock analyst recommendation found.'
      );

      expect(repository.getBestRecommendation).toHaveBeenCalledTimes(2);
    });

    it('should handle repository errors', async () => {
      // Arrange
      const error = new Error('Database connection failed');

      repository.getBestRecommendation.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(
        'Database connection failed'
      );
      expect(repository.getBestRecommendation).toHaveBeenCalledTimes(1);
    });

    it('should return recommendation with different scores correctly', async () => {
      // Arrange
      const appleAnalysis = StockAnalystMother.createWithScore(95); // High score

      repository.getBestRecommendation.mockResolvedValue(appleAnalysis);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.score).toBe(95);
      expect(result.stockId).toBe('1');
    });
  });
});
