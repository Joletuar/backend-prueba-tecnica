import type { Stock as PrismaStock } from '@prisma/client';

import type { Stock } from '../../../domain/stock.entity';

export const StockPrismaMapper = {
  toDomain(entity: PrismaStock): Stock {
    return {
      id: entity.id,
      ticker: entity.ticker,
      companyName: entity.company_name,
      brokerage: entity.brokerage,
      action: entity.action,
      ratingFrom: entity.rating_from,
      ratingTo: entity.rating_to,
      targetFrom: entity.target_from,
      targetTo: entity.target_to,
      time: entity.time,
    };
  },

  toDomainList(entities: PrismaStock[]): Stock[] {
    return entities.map((entity) => this.toDomain(entity));
  },

  toPrisma(entity: Stock): Omit<PrismaStock, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      ticker: entity.ticker,
      company_name: entity.companyName,
      brokerage: entity.brokerage,
      action: entity.action,
      rating_from: entity.ratingFrom,
      rating_to: entity.ratingTo,
      target_from: entity.targetFrom,
      target_to: entity.targetTo,
      time: entity.time,
    };
  },
};
