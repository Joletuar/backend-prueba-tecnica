export interface StockAnalystDto {
  id: string;
  stockId: string;
  currentPrice: number;
  potentialGrowth: number;
  score: number;
  reason: string;
}
