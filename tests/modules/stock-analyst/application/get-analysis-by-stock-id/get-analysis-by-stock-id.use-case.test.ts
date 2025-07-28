import { GetAnalysisByStockId } from '../../../../../src/modules/stock-analyst/application/get-analysis-by-stock-id/get-analysis-by-stock-id.use-case';
import type { StockAnalystRepository } from '../../../../../src/modules/stock-analyst/domain/stock-analyst.repository';
import { createStockAnalystRepositoryMock } from '../__mocks__/stock-analyst-repository.mock';
import { StockAnalystMother } from '../helpers/stock-analyst.mother';

describe('GetAnalysisByStockId', () => {
  let useCase: GetAnalysisByStockId;
  let repository: jest.Mocked<StockAnalystRepository>;

  beforeEach(() => {
    repository = createStockAnalystRepositoryMock();

    useCase = new GetAnalysisByStockId(repository);
  });

  describe('#execute', () => {
    it('should return stock analysis for given stock id', async () => {
      // Arrange
      const stockId = '1';
      const analysisEntities = [StockAnalystMother.nvidia()];

      repository.findByStockId.mockResolvedValue(analysisEntities);

      // Act
      const result = await useCase.execute({ stockId });

      // Assert
      expect(repository.findByStockId).toHaveBeenCalledWith(stockId);
      expect(repository.findByStockId).toHaveBeenCalledTimes(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: analysisEntities[0]!.id,
        stockId: analysisEntities[0]!.stockId,
        currentPrice: analysisEntities[0]!.currentPrice,
        potentialGrowth: analysisEntities[0]!.potentialGrowth,
        score: analysisEntities[0]!.score,
        reason: analysisEntities[0]!.reason,
      });
    });

    it('should return multiple analysis for a stock with multiple records', async () => {
      // Arrange
      const stockId = '1';
      const analysisEntities = [
        StockAnalystMother.nvidia(),
        StockAnalystMother.createWithScore(75),
      ];

      repository.findByStockId.mockResolvedValue(analysisEntities);

      // Act
      const result = await useCase.execute({ stockId });

      // Assert
      expect(repository.findByStockId).toHaveBeenCalledWith(stockId);
      expect(result).toHaveLength(2);
      expect(result[0]!.score).toBe(85);
      expect(result[1]!.score).toBe(75);
    });

    it('should return empty array when no analysis found for stock id', async () => {
      // Arrange
      const stockId = 'non-existent';

      repository.findByStockId.mockResolvedValue([]);

      // Act
      const result = await useCase.execute({ stockId });

      // Assert
      expect(repository.findByStockId).toHaveBeenCalledWith(stockId);
      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle repository errors', async () => {
      // Arrange
      const stockId = '1';
      const error = new Error('Database connection failed');

      repository.findByStockId.mockRejectedValue(error);

      // Act & Assert
      await expect(useCase.execute({ stockId })).rejects.toThrow(
        'Database connection failed'
      );
      expect(repository.findByStockId).toHaveBeenCalledWith(stockId);
    });
  });
});
