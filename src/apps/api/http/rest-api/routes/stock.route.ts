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

    /**
     * @swagger
     * /stocks:
     *   get:
     *     tags:
     *       - Stocks
     *     summary: Obtener todos los stocks
     *     description: Retorna una lista paginada de stocks con filtros opcionales
     *     parameters:
     *       - in: query
     *         name: next
     *         schema:
     *           type: string
     *         description: Cursor para la siguiente página
     *       - in: query
     *         name: prev
     *         schema:
     *           type: string
     *         description: Cursor para la página anterior
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *         description: Límite de elementos por página (1-100)
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *         description: Término de búsqueda para filtrar por ticker o empresa
     *       - in: query
     *         name: brokerage
     *         schema:
     *           type: string
     *         description: Filtrar por brokage
     *       - in: query
     *         name: sortOrder
     *         schema:
     *           type: string
     *           enum: [asc, desc]
     *         description: Orden de clasificación
     *       - in: query
     *         name: sortField
     *         schema:
     *           type: string
     *           enum: [time, action, brokerage]
     *         description: Campo por el cual ordenar
     *     responses:
     *       200:
     *         description: Lista de stocks obtenida exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/PaginatedStocks'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    subRouter.get(
      '/',
      validateQuery(GetStocksQuerySchema),
      this.controller.getAll.bind(this.controller)
    );

    /**
     * @swagger
     * /stocks/brokerages:
     *   get:
     *     tags:
     *       - Stocks
     *     summary: Obtener todas las casas de corretaje
     *     description: Retorna una lista de todas las casas de corretaje disponibles
     *     responses:
     *       200:
     *         description: Lista de casas de corretaje obtenida exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     type: string
     *                   description: Lista de todos los brokages
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    subRouter.get(
      '/brokerages',
      this.controller.getAllBrokerages.bind(this.controller)
    );

    /**
     * @swagger
     * /stocks/{id}:
     *   get:
     *     tags:
     *       - Stocks
     *     summary: Obtener stock por ID
     *     description: Retorna un stock específico por su ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: ulid
     *         description: ID único del stock (ULID)
     *     responses:
     *       200:
     *         description: Stock obtenido exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/Stock'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    subRouter.get(
      '/:id',
      validateParams(GetStockByIdParamsSchema),
      this.controller.getById.bind(this.controller)
    );

    router.use(`/${this.NAME}`, subRouter);
  }
}
