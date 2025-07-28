import type { Stock } from '../domain/stock.entity';
import type { StockDto } from './stock.dto';

export const StockMapper = {
  toDto: (entity: Stock): StockDto => {
    return {
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
  },

  toDtoList: (entities: Stock[]): StockDto[] => {
    return entities.map(StockMapper.toDto);
  },
};
