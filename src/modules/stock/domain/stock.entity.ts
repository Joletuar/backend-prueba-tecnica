export interface Stock {
  id: string;
  ticker: string;
  companyName: string;
  brokerage: string;
  action: string;
  ratingFrom: string;
  ratingTo: string;
  targetFrom: number;
  targetTo: number;
  time: Date;
}
