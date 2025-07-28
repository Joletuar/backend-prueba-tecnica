import type { Request, Response } from 'express';
import status from 'http-status';

import type { GenerateAnalysis } from '../../../../../modules/stock-analyst/application/generate-analysis/generate-analysis.use-case';
import type { GetAnalysisByStockId } from '../../../../../modules/stock-analyst/application/get-analysis-by-stock-id/get-analysis-by-stock-id.use-case';
import type { GetBestRecommendation } from '../../../../../modules/stock-analyst/application/get-best-recommendation/get-best-recommendation.use-case';
import { ResponseBuilder } from '../helpers/response.builder';

export class StockAnalystController {
  constructor(
    private readonly getBestRecommendation: GetBestRecommendation,
    private readonly generateAnalysis: GenerateAnalysis,
    private readonly getAnalysisByStockId: GetAnalysisByStockId
  ) {}

  async generate(req: Request, res: Response): Promise<Response> {
    const result = await this.generateAnalysis.execute();

    return ResponseBuilder.success({
      res,
      req,
      statusCode: status.OK,
      data: result,
    });
  }

  async getBest(req: Request, res: Response): Promise<Response> {
    const analysis = await this.getBestRecommendation.execute();

    return ResponseBuilder.success({
      res,
      req,
      statusCode: status.OK,
      data: analysis,
    });
  }

  async getByStockId(req: Request, res: Response): Promise<Response> {
    const params = (req as any).validatedParams as { stockId: string };

    const analysis = await this.getAnalysisByStockId.execute({
      stockId: params.stockId,
    });

    return ResponseBuilder.success({
      res,
      req,
      statusCode: status.OK,
      data: analysis,
    });
  }
}
