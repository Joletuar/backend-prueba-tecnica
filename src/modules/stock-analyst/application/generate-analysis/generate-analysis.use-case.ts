import type { Stock } from '../../../stock/domain/stock.entity';
import type { StockRepository } from '../../../stock/domain/stock.repository';
import type {
  ExternalDataProvider,
  StockPriceData,
} from '../../domain/external-data-provider.interface';
import type { StockAnalystAlgorithm } from '../../domain/stock-analyst-algorithm.interface';
import type { StockAnalyst } from '../../domain/stock-analyst.entity';
import type { StockAnalystRepository } from '../../domain/stock-analyst.repository';

export interface GenerateAnalysisResponse {
  totalGenerated: number;
  message: string;
}

export class GenerateAnalysis {
  constructor(
    private readonly stockRepository: StockRepository,
    private readonly stockAnalystRepository: StockAnalystRepository,
    private readonly externalDataProvider: ExternalDataProvider,
    private readonly stockAnalystAlgorithm: StockAnalystAlgorithm
  ) {}

  async execute(): Promise<GenerateAnalysisResponse> {
    // 1. Clear existing analysis
    await this.stockAnalystRepository.deleteAll();

    // 2. Get all stocks from database
    const stocks = await this.stockRepository.findAll();

    if (stocks.length === 0) {
      return {
        totalGenerated: 0,
        message: 'No stocks found in database',
      };
    }

    // 3. Get unique tickers
    const uniqueTickers = this.getUniqueTickers(stocks);

    // 4. Fetch current prices for all tickers
    const priceData = await this.getPriceData(uniqueTickers);

    // 5. Generate analysis for all stocks
    const analysis = this.generateAnalysis(stocks, priceData);

    // 6. Save all analysis to database
    await this.stockAnalystRepository.saveMany(analysis);

    return {
      totalGenerated: analysis.length,
      message: `Successfully generated ${analysis.length} stock analysis`,
    };
  }

  private getUniqueTickers(stocks: Stock[]): string[] {
    return [...new Set(stocks.map((stock) => stock.ticker))];
  }

  private async getPriceData(tickers: string[]): Promise<StockPriceData[]> {
    return await this.externalDataProvider.getBatchCurrentPrices(tickers);
  }

  private generateAnalysis(
    stocks: Stock[],
    priceData: StockPriceData[]
  ): StockAnalyst[] {
    const priceMap = new Map(priceData.map((price) => [price.ticker, price]));

    return stocks.map((stock) => {
      const currentPrice = priceMap.get(stock.ticker) || null;
      return this.stockAnalystAlgorithm.createAnalysis(stock, currentPrice);
    });
  }
}
