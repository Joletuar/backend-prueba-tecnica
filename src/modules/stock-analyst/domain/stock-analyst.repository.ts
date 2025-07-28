import type { StockAnalyst } from './stock-analyst.entity';

export interface StockAnalystRepository {
  saveMany(analysts: StockAnalyst[]): Promise<StockAnalyst[]>;
  getBestRecommendation(): Promise<StockAnalyst | null>;
  findByStockId(stockId: string): Promise<StockAnalyst[]>;
  deleteAll(): Promise<void>;
}
