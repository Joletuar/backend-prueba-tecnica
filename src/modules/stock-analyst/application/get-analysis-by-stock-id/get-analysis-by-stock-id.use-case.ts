import type { StockAnalystRepository } from '../../domain/stock-analyst.repository';
import type { StockAnalystDto } from '../stock-analyst.dto';
import { StockAnalystMapper } from '../stock-analyst.mapper';
import type { GetAnalysisByStockIdDto } from './get-analysis-by-stock-id.dto';

export class GetAnalysisByStockId {
  constructor(
    private readonly stockAnalystRepository: StockAnalystRepository
  ) {}

  async execute(props: GetAnalysisByStockIdDto): Promise<StockAnalystDto[]> {
    const { stockId } = props;

    const analysis = await this.stockAnalystRepository.findByStockId(stockId);

    return StockAnalystMapper.toDtoList(analysis);
  }
}
