import type { Stock } from '../../stock/domain/stock.entity';
import type { StockPriceData } from './external-data-provider.interface';
import type { StockAnalyst } from './stock-analyst.entity';

export interface StockAnalystAlgorithm {
  calculateScore(stock: Stock, priceData: StockPriceData | null): number;
  generateReason(stock: Stock, priceData: StockPriceData | null): string;
  createAnalysis(stock: Stock, priceData: StockPriceData | null): StockAnalyst;
}
