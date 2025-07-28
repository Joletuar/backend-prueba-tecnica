import type { Router } from 'express';
import PromiseRouter from 'express-promise-router';

import type { StockAnalystController } from '../controllers/stock-analyst.controller';
import { validateParams } from '../middlewares/validation.middleware';
import { GetAnalysisByStockIdSchema } from '../schemas/stock-analyst/stock-analyst.schema';
import type { RegistarRoute } from './registar-route';

export class StockAnalystRoute implements RegistarRoute {
  NAME: string = 'stock-analyst';

  constructor(private readonly controller: StockAnalystController) {}

  register(router: Router): void {
    const subRouter = PromiseRouter();

    subRouter.post('/generate', this.controller.generate.bind(this.controller));

    subRouter.get('/best', this.controller.getBest.bind(this.controller));

    subRouter.get(
      '/stock/:stockId',
      validateParams(GetAnalysisByStockIdSchema),
      this.controller.getByStockId.bind(this.controller)
    );

    router.use(`/${this.NAME}`, subRouter);
  }
}
