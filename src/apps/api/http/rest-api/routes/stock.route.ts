import type { Router } from 'express';
import PromiseRouter from 'express-promise-router';

import type { StockController } from '../controllers/stock.controller';
import {
  validateParams,
  validateQuery,
} from '../middlewares/validation.middleware';
import {
  GetStockByIdParamsSchema,
  GetStocksQuerySchema,
} from '../schemas/stock/stock.schema';
import type { RegistarRoute } from './registar-route';

export class StockRoute implements RegistarRoute {
  NAME: string = 'stocks';

  constructor(private readonly controller: StockController) {}

  register(router: Router): void {
    const subRouter = PromiseRouter();

    subRouter.get(
      '/',
      validateQuery(GetStocksQuerySchema),
      this.controller.getAll.bind(this.controller)
    );

    subRouter.get(
      '/brokerages',
      this.controller.getAllBrokerages.bind(this.controller)
    );

    subRouter.get(
      '/:id',
      validateParams(GetStockByIdParamsSchema),
      this.controller.getById.bind(this.controller)
    );

    router.use(`/${this.NAME}`, subRouter);
  }
}
