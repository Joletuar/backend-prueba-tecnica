import z from 'zod';

export const GetAnalysisByStockIdSchema = z.object({
  stockId: z.ulid(),
});

export type GetAnalysisByStockIdParams = z.infer<
  typeof GetAnalysisByStockIdSchema
>;
