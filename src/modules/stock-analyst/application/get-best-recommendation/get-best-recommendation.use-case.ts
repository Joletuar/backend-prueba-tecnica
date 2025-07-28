import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import type { StockAnalystRepository } from '../../domain/stock-analyst.repository';
import type { StockAnalystDto } from '../stock-analyst.dto';
import { StockAnalystMapper } from '../stock-analyst.mapper';

export class GetBestRecommendation {
  constructor(private readonly repository: StockAnalystRepository) {}

  async execute(): Promise<StockAnalystDto> {
    const analyst = await this.repository.getBestRecommendation();

    if (!analyst) {
      throw new NotFoundError('No stock analyst recommendation found.');
    }

    return StockAnalystMapper.toDto(analyst);
  }
}
