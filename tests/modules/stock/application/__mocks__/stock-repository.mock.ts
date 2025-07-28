import type { StockRepository } from '../../../../../src/modules/stock/domain/stock.repository';

export const createStockRepositoryMock = (): jest.Mocked<StockRepository> => ({
  getAll: jest.fn(),
  getAllBrokerages: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
});
