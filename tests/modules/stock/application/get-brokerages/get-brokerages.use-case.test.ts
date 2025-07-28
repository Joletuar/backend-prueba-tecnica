import { GetBrokerages } from '../../../../../src/modules/stock/application/get-brokerages/get-brokerages.use-case';
import { createStockRepositoryMock } from '../__mocks__/stock-repository.mock';

describe('GetBrokerages', () => {
  let getBrokerages: GetBrokerages;
  let stockRepository: ReturnType<typeof createStockRepositoryMock>;

  beforeEach(() => {
    stockRepository = createStockRepositoryMock();
    getBrokerages = new GetBrokerages(stockRepository);
  });

  describe('#execute', () => {
    it('should return all unique brokerages', async () => {
      // Arrange
      const expectedBrokerages = [
        'Goldman Sachs',
        'JP Morgan',
        'Morgan Stanley',
      ];
      stockRepository.getAllBrokerages.mockResolvedValue(expectedBrokerages);

      // Act
      const result = await getBrokerages.execute();

      // Assert
      expect(result).toEqual(expectedBrokerages);
      expect(stockRepository.getAllBrokerages).toHaveBeenCalledTimes(1);
    });

    it('should handle empty brokerage list', async () => {
      // Arrange
      stockRepository.getAllBrokerages.mockResolvedValue([]);

      // Act
      const result = await getBrokerages.execute();

      // Assert
      expect(result).toEqual([]);
      expect(stockRepository.getAllBrokerages).toHaveBeenCalledTimes(1);
    });
  });
});
