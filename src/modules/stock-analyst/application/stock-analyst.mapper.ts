import type { StockAnalyst } from '../domain/stock-analyst.entity';
import type { StockAnalystDto } from './stock-analyst.dto';

export const StockAnalystMapper = {
  toDto(entity: StockAnalyst): StockAnalystDto {
    return {
      id: entity.id,
      stockId: entity.stockId,
      currentPrice: entity.currentPrice,
      potentialGrowth: entity.potentialGrowth,
      score: entity.score,
      reason: entity.reason,
    };
  },

  toDtoList(entities: StockAnalyst[]): StockAnalystDto[] {
    return entities.map(this.toDto);
  },
};
