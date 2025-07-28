import type { StockAnalystRepository } from '../../../../../src/modules/stock-analyst/domain/stock-analyst.repository';

export const createStockAnalystRepositoryMock =
  (): jest.Mocked<StockAnalystRepository> => {
    return {
      saveMany: jest.fn().mockResolvedValue([]),
      getBestRecommendation: jest.fn().mockResolvedValue(null),
      findByStockId: jest.fn().mockResolvedValue([]),
      deleteAll: jest.fn().mockResolvedValue(undefined),
    };
  };
