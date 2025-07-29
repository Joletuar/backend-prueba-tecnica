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

    /**
     * @swagger
     * /stock-analyst/generate:
     *   post:
     *     tags:
     *       - Stock Analyst
     *     summary: Generar análisis de stock
     *     description: Genera un nuevo análisis para todos los stocks disponibles
     *     responses:
     *       201:
     *         description: Análisis generado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: "Análisis generado exitosamente"
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    subRouter.post('/generate', this.controller.generate.bind(this.controller));

    /**
     * @swagger
     * /stock-analyst/best:
     *   get:
     *     tags:
     *       - Stock Analyst
     *     summary: Obtener la mejor recomendación
     *     description: Retorna la mejor recomendación de análisis disponible
     *     responses:
     *       200:
     *         description: Obtener el mejor stock
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/StockAnalyst'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    subRouter.get('/best', this.controller.getBest.bind(this.controller));

    /**
     * @swagger
     * /stock-analyst/stock/{stockId}:
     *   get:
     *     tags:
     *       - Stock Analyst
     *     summary: Obtener análisis por ID de stock
     *     description: Retorna el análisis específico para un stock dado
     *     parameters:
     *       - in: path
     *         name: stockId
     *         required: true
     *         schema:
     *           type: string
     *           format: ulid
     *         description: ID único del stock (ULID)
     *     responses:
     *       200:
     *         description: Análisis obtenido exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   $ref: '#/components/schemas/StockAnalyst'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       500:
     *         $ref: '#/components/responses/InternalServerError'
     */
    subRouter.get(
      '/stock/:stockId',
      validateParams(GetAnalysisByStockIdSchema),
      this.controller.getByStockId.bind(this.controller)
    );

    router.use(`/${this.NAME}`, subRouter);
  }
}
