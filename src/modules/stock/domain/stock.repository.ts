import type { PaginatedEntityWithCursor } from '../../shared/domain/paginated-with-cursor';
import type { PaginatedWithCursorProps } from '../../shared/domain/paginated-with-cursor-props';
import type { StockCursor } from './stock-cursor';
import type { Stock } from './stock.entity';

export interface StockFilters {
  search?: string;
  ticker?: string;
  brokerage?: string;
}

export interface StockSort {
  field: 'time' | 'action' | 'brokerage';
  order: 'asc' | 'desc';
}

export interface GetAllStocksProps
  extends PaginatedWithCursorProps<StockCursor> {
  filters?: StockFilters;
  sort?: StockSort;
}

export interface StockRepository {
  getAll(
    props: GetAllStocksProps
  ): Promise<PaginatedEntityWithCursor<Stock, StockCursor>>;
  getAllBrokerages(): Promise<string[]>;
  findAll(): Promise<Stock[]>;
  findById(id: string): Promise<Stock | null>;
}
