import status from 'http-status';

import { AppError } from '../../../../../shared/domain/errors/app.error';
import { InfraestructureError } from '../../../../../shared/domain/errors/infraestructure.error';
import { PRISMA_CLIENT } from '../../../../../shared/infraestructure/prisma/prisma-client';
import type { StockAnalyst } from '../../../../domain/stock-analyst.entity';
import type { StockAnalystRepository } from '../../../../domain/stock-analyst.repository';
import { StockAnalystPrismaMapper } from './stock-analyst-prisma.mapper';

export class CockroachdbStockAnalystRepository
  implements StockAnalystRepository
{
  private readonly prismaClient = PRISMA_CLIENT;

  async saveMany(analysts: StockAnalyst[]): Promise<StockAnalyst[]> {
    try {
      const prismaData = analysts.map((analyst) =>
        StockAnalystPrismaMapper.toPrisma(analyst)
      );

      await this.prismaClient.stockAnalysis.createMany({
        data: prismaData,
      });

      const savedAnalysis = await this.prismaClient.stockAnalysis.findMany({
        where: {
          id: {
            in: analysts.map((r) => r.id),
          },
        },
      });

      return savedAnalysis.map(StockAnalystPrismaMapper.toDomain);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async getBestRecommendation(): Promise<StockAnalyst | null> {
    try {
      const recommendation = await this.prismaClient.stockAnalysis.findFirst({
        orderBy: [{ score: 'desc' }, { created_at: 'desc' }],
      });

      if (!recommendation) return null;

      return StockAnalystPrismaMapper.toDomain(recommendation);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async findByStockId(stockId: string): Promise<StockAnalyst[]> {
    try {
      const result = await this.prismaClient.stockAnalysis.findMany({
        where: { stock_id: stockId },
        include: {
          stock: true,
        },
        orderBy: [{ score: 'desc' }, { created_at: 'desc' }],
      });

      return StockAnalystPrismaMapper.toDomainList(result);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.prismaClient.stockAnalysis.deleteMany({});
    } catch (error) {
      this.errorHandler(error);
    }
  }

  private errorHandler(error: unknown): never {
    if (error instanceof AppError) throw error;

    throw new InfraestructureError({
      message: 'Error in the stock analyst repository.',
      statusCode: status.INTERNAL_SERVER_ERROR,
      isCritical: true,
      originalError: error,
    });
  }
}
