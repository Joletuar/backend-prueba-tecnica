export interface StockAnalyst {
  id: string;
  stockId: string;
  currentPrice: number;
  potentialGrowth: number;
  score: number;
  reason: string;
}
