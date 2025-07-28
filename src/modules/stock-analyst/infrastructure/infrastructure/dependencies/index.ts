import * as stockDeps from '../../../../stock/infraestructure/dependencies/index';
import { GenerateAnalysis } from '../../../application/generate-analysis/generate-analysis.use-case';
import { GetAnalysisByStockId } from '../../../application/get-analysis-by-stock-id/get-analysis-by-stock-id.use-case';
import { GetBestRecommendation } from '../../../application/get-best-recommendation/get-best-recommendation.use-case';
import { SmartStockAnalystAlgorithm } from '../../../domain/smart-stock-analyst.algorithm';
import { YahooFinanceProvider } from '../external-data/yahoo-finance.provider';
import { CockroachdbStockAnalystRepository } from '../persistence/cockroachdb/cockroachdb-stock-analyst.repository';

const externalDataProvider = new YahooFinanceProvider();
const stockAnalystAlgorithm = new SmartStockAnalystAlgorithm();
const stockAnalystRepository = new CockroachdbStockAnalystRepository();

export const generateAnalysis = new GenerateAnalysis(
  stockDeps.repository,
  stockAnalystRepository,
  externalDataProvider,
  stockAnalystAlgorithm
);
export const getBestRecommendation = new GetBestRecommendation(
  stockAnalystRepository
);

export const getAnalysisByStockId = new GetAnalysisByStockId(
  stockAnalystRepository
);
