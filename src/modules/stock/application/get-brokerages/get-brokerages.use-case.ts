import type { StockRepository } from '../../domain/stock.repository';

export class GetBrokerages {
  constructor(private readonly repository: StockRepository) {}

  async execute(): Promise<string[]> {
    return await this.repository.getAllBrokerages();
  }
}
