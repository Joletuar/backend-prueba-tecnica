import {
  generateAnalysis,
  getAnalysisByStockId,
  getBestRecommendation,
} from '../../../../modules/stock-analyst/infrastructure/infrastructure/dependencies';
import { StockAnalystController } from '../../http/rest-api/controllers/stock-analyst.controller';
import { StockAnalystRoute } from '../../http/rest-api/routes/stock-analyst.route';

const controller = new StockAnalystController(
  getBestRecommendation,
  generateAnalysis,
  getAnalysisByStockId
);

export const stockAnalystRoute = new StockAnalystRoute(controller);
