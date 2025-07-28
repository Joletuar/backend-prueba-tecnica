import type { StockDto } from '../../../../src/modules/stock/application/stock.dto';
import { StockMapper } from '../../../../src/modules/stock/application/stock.mapper';
import { StockMother } from './helpers/stock.mother';

describe('StockMapper', () => {
  describe('#toDto', () => {
    it('should map entity to dto correctly', () => {
      const entity = StockMother.create();
      const expectedDto: StockDto = {
        id: entity.id,
        ticker: entity.ticker,
        companyName: entity.companyName,
        brokerage: entity.brokerage,
        action: entity.action,
        ratingFrom: entity.ratingFrom,
        ratingTo: entity.ratingTo,
        targetFrom: entity.targetFrom,
        targetTo: entity.targetTo,
        time: entity.time.toUTCString(),
      };

      const result = StockMapper.toDto(entity);

      expect(result).toEqual(expectedDto);
    });

    it('should convert date to UTC string format', () => {
      const customDate = new Date('2024-03-20T14:30:00Z');
      const entity = StockMother.create({ time: customDate });
      const expectedDate = customDate.toUTCString();

      const result = StockMapper.toDto(entity);

      expect(result.time).toBe(expectedDate);
    });
  });

  describe('#toDtoList', () => {
    it('should map list of entities to list of dtos', () => {
      const entities = StockMother.createList(2);
      const expectedDtos: StockDto[] = entities.map((entity) => ({
        id: entity.id,
        ticker: entity.ticker,
        companyName: entity.companyName,
        brokerage: entity.brokerage,
        action: entity.action,
        ratingFrom: entity.ratingFrom,
        ratingTo: entity.ratingTo,
        targetFrom: entity.targetFrom,
        targetTo: entity.targetTo,
        time: entity.time.toUTCString(),
      }));

      const result = StockMapper.toDtoList(entities);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expectedDtos[0]);
      expect(result[1]).toEqual(expectedDtos[1]);
    });

    it('#should return empty array for empty input', () => {
      const entities: any[] = [];

      const result = StockMapper.toDtoList(entities);

      expect(result).toEqual([]);
    });
  });
});
