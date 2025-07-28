import { StockAnalystMapper } from '../../../../src/modules/stock-analyst/application/stock-analyst.mapper';
import { StockAnalystMother } from './helpers/stock-analyst.mother';

describe('StockAnalystMapper', () => {
  describe('#toDto', () => {
    it('should map StockAnalyst entity to StockAnalystDto', () => {
      // Arrange
      const entity = StockAnalystMother.nvidia();

      // Act
      const dto = StockAnalystMapper.toDto(entity);

      // Assert
      expect(dto).toEqual({
        id: entity.id,
        stockId: entity.stockId,
        currentPrice: entity.currentPrice,
        potentialGrowth: entity.potentialGrowth,
        score: entity.score,
        reason: entity.reason,
      });

      expect(dto).toHaveProperty('id');
    });

    it('should handle different stock analysis', () => {
      // Arrange
      const teslaEntity = StockAnalystMother.tesla();

      // Act
      const dto = StockAnalystMapper.toDto(teslaEntity);

      // Assert
      expect(dto.stockId).toBe('2');
      expect(dto.currentPrice).toBe(280);
      expect(dto.potentialGrowth).toBe(-10.7);
      expect(dto.score).toBe(15);
    });
  });

  describe('#toDtoList', () => {
    it('should map array of StockAnalyst entities to array of StockAnalystDto', () => {
      // Arrange
      const entities = StockAnalystMother.createMany();

      // Act
      const dtos = StockAnalystMapper.toDtoList(entities);

      // Assert
      expect(dtos).toHaveLength(3);

      expect(dtos[0]!.stockId).toBe('1');
      expect(dtos[0]!.score).toBe(85);

      expect(dtos[1]!.stockId).toBe('2');
      expect(dtos[1]!.score).toBe(15);

      expect(dtos[2]!.stockId).toBe('3');
      expect(dtos[2]!.score).toBe(45);

      dtos.forEach((dto) => {
        expect(dto).toHaveProperty('id');
      });
    });

    it('should handle empty array', () => {
      // Arrange
      const entities: never[] = [];

      // Act
      const dtos = StockAnalystMapper.toDtoList(entities);

      // Assert
      expect(dtos).toHaveLength(0);
      expect(Array.isArray(dtos)).toBe(true);
    });

    it('should map single item array correctly', () => {
      // Arrange
      const entities = [StockAnalystMother.apple()];

      // Act
      const dtos = StockAnalystMapper.toDtoList(entities);

      // Assert
      expect(dtos).toHaveLength(1);
      expect(dtos[0]!.stockId).toBe('3');
      expect(dtos[0]!.currentPrice).toBe(180);
    });
  });
});
