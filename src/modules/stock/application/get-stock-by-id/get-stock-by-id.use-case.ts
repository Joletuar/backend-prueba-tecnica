import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import type { StockRepository } from '../../domain/stock.repository';
import type { StockDto } from '../stock.dto';
import { StockMapper } from '../stock.mapper';
import type { GetStockByIdDto } from './get-stock-by-id.dto';

export class GetStockById {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(props: GetStockByIdDto): Promise<StockDto> {
    const { id } = props;

    const stock = await this.stockRepository.findById(id);

    if (!stock) throw new NotFoundError(`Stock with not found`);

    return StockMapper.toDto(stock);
  }
}
