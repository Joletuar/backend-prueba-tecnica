import { GetAllStocks } from '../../../../../src/modules/stock/application/get-all-stocks/get-all-stocks.use-case';
import { StockCursorService } from '../../../../../src/modules/stock/application/stock-cursor.service';
import { StockMapper } from '../../../../../src/modules/stock/application/stock.mapper';
import { createStockRepositoryMock } from '../__mocks__/stock-repository.mock';
import { StockCursorMother, StockMother } from '../helpers/stock.mother';

jest.mock('../../../../../src/modules/stock/application/stock-cursor.service');
jest.mock('../../../../../src/modules/stock/application/stock.mapper');

describe('GetAllStocks', () => {
  let useCase: GetAllStocks;
  let repositoryMock: ReturnType<typeof createStockRepositoryMock>;
  let cursorServiceMock: jest.Mocked<typeof StockCursorService>;
  let mapperMock: jest.Mocked<typeof StockMapper>;

  beforeEach(() => {
    repositoryMock = createStockRepositoryMock();
    cursorServiceMock = StockCursorService as jest.Mocked<
      typeof StockCursorService
    >;
    mapperMock = StockMapper as jest.Mocked<typeof StockMapper>;

    useCase = new GetAllStocks(repositoryMock);
  });

  describe('#execute', () => {
    it('should return paginated stocks without cursors', async () => {
      // Arrange
      const size = 10;
      const entities = StockMother.createList(size);
      const dtos = entities.map((entity) => StockMapper.toDto(entity));

      repositoryMock.getAll.mockResolvedValue({
        entities,
        next: null,
        prev: null,
      });
      mapperMock.toDtoList.mockReturnValue(dtos);

      const props = { cursor: { limit: size }, filters: {} };

      // Act
      const result = await useCase.execute(props);

      // Assert
      expect(result).toEqual({
        dtos,
        next: null,
        prev: null,
      });
      expect(repositoryMock.getAll).toHaveBeenCalledWith({
        limit: size,
        next: null,
        prev: null,
        filters: {},
        sort: undefined,
      });
      expect(result.dtos).toStrictEqual(dtos);
      expect(result.dtos).toHaveLength(size);
      expect(result.dtos[0]).toEqual(dtos[0]);
    });

    it('should return paginated stocks with cursors', async () => {
      // Arrange
      const entities = StockMother.createList(2);
      const dtos = [
        StockMother.createDto({
          id: 'stock-1',
          ticker: 'AAPL',
        }),
        StockMother.createDto({
          id: 'stock-2',
          ticker: 'MSFT',
        }),
      ];
      const nextCursor = StockCursorMother.create({
        id: 'stock-2',
      });
      const prevCursor = StockCursorMother.create({
        id: 'stock-1',
      });
      const encodedNext = 'encoded-next';
      const encodedPrev = 'encoded-prev';

      repositoryMock.getAll.mockResolvedValue({
        entities,
        next: nextCursor,
        prev: prevCursor,
      });
      mapperMock.toDtoList.mockReturnValue(dtos);
      cursorServiceMock.decode.mockReturnValue(nextCursor);
      cursorServiceMock.encode
        .mockReturnValueOnce(encodedNext)
        .mockReturnValueOnce(encodedPrev);

      const props = {
        cursor: {
          limit: 10,
          next: 'some-next-cursor',
          prev: 'some-prev-cursor',
        },
        filters: {},
      };

      // Act
      const result = await useCase.execute(props);

      // Assert
      expect(result).toEqual({
        dtos,
        next: encodedNext,
        prev: encodedPrev,
      });
      expect(repositoryMock.getAll).toHaveBeenCalledWith({
        limit: 10,
        next: nextCursor,
        prev: nextCursor,
        filters: {},
        sort: undefined,
      });
      expect(mapperMock.toDtoList).toHaveBeenCalledWith(entities);
    });

    it('should handle null cursors', async () => {
      // Arrange
      const entities = StockMother.createList(1);
      const dtos = [StockMother.createDto()];
      const SIZE = 10;

      repositoryMock.getAll.mockResolvedValue({
        entities,
        next: null,
        prev: null,
      });
      mapperMock.toDtoList.mockReturnValue(dtos);

      const props = { cursor: { limit: SIZE }, filters: {} };

      // Act
      const result = await useCase.execute(props);

      // Assert
      expect(result).toEqual({
        dtos,
        next: null,
        prev: null,
      });
      expect(repositoryMock.getAll).toHaveBeenCalledWith({
        limit: SIZE,
        next: null,
        prev: null,
        filters: {},
        sort: undefined,
      });
      expect(cursorServiceMock.decode).not.toHaveBeenCalled();
      expect(cursorServiceMock.encode).not.toHaveBeenCalled();
    });

    it('should decode cursors when provided', async () => {
      // Arrange
      const entities = StockMother.createList(1);
      const dtos = [StockMother.createDto()];
      const decodedCursor = StockCursorMother.create();

      repositoryMock.getAll.mockResolvedValue({
        entities,
        next: null,
        prev: null,
      });
      mapperMock.toDtoList.mockReturnValue(dtos);
      cursorServiceMock.decode.mockReturnValue(decodedCursor);

      const props = {
        cursor: {
          limit: 5,
          next: 'encoded-cursor',
        },
        filters: {},
      };

      // Act
      await useCase.execute(props);

      // Assert
      expect(cursorServiceMock.decode).toHaveBeenCalledWith('encoded-cursor');
      expect(repositoryMock.getAll).toHaveBeenCalledWith({
        limit: 5,
        next: decodedCursor,
        prev: null,
        filters: {},
        sort: undefined,
      });
    });

    it('should encode response cursors when present', async () => {
      // Arrange
      const entities = StockMother.createList(1);
      const dtos = [StockMother.createDto()];
      const nextCursor = StockCursorMother.create();
      const encodedCursor = 'encoded-response-cursor';

      repositoryMock.getAll.mockResolvedValue({
        entities,
        next: nextCursor,
        prev: null,
      });
      mapperMock.toDtoList.mockReturnValue(dtos);
      cursorServiceMock.encode.mockReturnValue(encodedCursor);

      const props = { cursor: { limit: 10 }, filters: {} };

      // Act
      const result = await useCase.execute(props);

      // Assert
      expect(cursorServiceMock.encode).toHaveBeenCalledWith(nextCursor);
      expect(result.next).toBe(encodedCursor);
      expect(result.prev).toBeNull();
    });

    it('should return empty list when no entities found', async () => {
      // Arrange
      repositoryMock.getAll.mockResolvedValue({
        entities: [],
        next: null,
        prev: null,
      });
      mapperMock.toDtoList.mockReturnValue([]);

      const props = { cursor: { limit: 10 }, filters: {} };

      // Act
      const result = await useCase.execute(props);

      // Assert
      expect(result).toEqual({
        dtos: [],
        next: null,
        prev: null,
      });
    });
  });
});
