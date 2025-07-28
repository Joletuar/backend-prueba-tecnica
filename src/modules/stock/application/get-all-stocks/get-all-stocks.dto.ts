export interface GetAllStocksDto {
  cursor: {
    next?: string | null;
    prev?: string | null;
    limit?: number;
  };
  filters: {
    search?: string;
    ticker?: string;
    brokerage?: string;
  };
  sort?: {
    field: 'time' | 'action' | 'brokerage';
    order: 'asc' | 'desc';
  };
}
