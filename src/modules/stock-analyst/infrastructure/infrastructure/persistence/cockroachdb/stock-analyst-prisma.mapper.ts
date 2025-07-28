import type { StockAnalysis as PrismaStockAnalysis } from '@prisma/client';

import type { StockAnalyst } from '../../../../domain/stock-analyst.entity';

export const StockAnalystPrismaMapper = {
  toDomain(prismaStockAnalysis: PrismaStockAnalysis): StockAnalyst {
    return {
      id: prismaStockAnalysis.id,
      stockId: prismaStockAnalysis.stock_id,
      currentPrice: prismaStockAnalysis.current_price,
      potentialGrowth: prismaStockAnalysis.potential_growth,
      score: prismaStockAnalysis.score,
      reason: prismaStockAnalysis.reason,
    };
  },

  toDomainList(prismaStockAnalysiss: PrismaStockAnalysis[]): StockAnalyst[] {
    return prismaStockAnalysiss.map(this.toDomain);
  },

  toPrisma(
    analyst: StockAnalyst
  ): Omit<PrismaStockAnalysis, 'created_at' | 'updated_at'> {
    return {
      id: analyst.id,
      stock_id: analyst.stockId,
      current_price: analyst.currentPrice,
      potential_growth: analyst.potentialGrowth,
      score: analyst.score,
      reason: analyst.reason,
    };
  },
};
