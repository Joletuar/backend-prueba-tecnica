export interface StockDto {
  id: string;
  ticker: string;
  companyName: string;
  brokerage: string;
  action: string;
  ratingFrom: string;
  ratingTo: string;
  targetFrom: number;
  targetTo: number;
  time: string;
}
