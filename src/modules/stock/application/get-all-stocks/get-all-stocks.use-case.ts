import type { PaginatedDtoWithCursor } from '../../../shared/application/paginated-with-cursor.dto';
import type { StockCursor } from '../../domain/stock-cursor';
import type { StockRepository } from '../../domain/stock.repository';
import { StockCursorService } from '../stock-cursor.service';
import type { StockDto } from '../stock.dto';
import { StockMapper } from '../stock.mapper';
import type { GetAllStocksDto } from './get-all-stocks.dto';

export class GetAllStocks {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(
    props: GetAllStocksDto
  ): Promise<PaginatedDtoWithCursor<StockDto>> {
    const { cursor, filters, sort } = props;

    const decodedNext = this.decodeCursor(cursor.next);
    const decodedPrev = this.decodeCursor(cursor.prev);

    const { entities, next, prev } = await this.stockRepository.getAll({
      limit: cursor.limit,
      next: decodedNext,
      prev: decodedPrev,
      filters,
      sort,
    });

    return {
      dtos: StockMapper.toDtoList(entities),
      next: this.encodeCursor(next),
      prev: this.encodeCursor(prev),
    };
  }

  private decodeCursor(cursor: string | null | undefined): StockCursor | null {
    return cursor ? StockCursorService.decode(cursor) : null;
  }

  private encodeCursor(cursor: StockCursor | null): string | null {
    return cursor ? StockCursorService.encode(cursor) : null;
  }
}
