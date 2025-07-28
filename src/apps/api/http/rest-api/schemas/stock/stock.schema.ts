import { z } from 'zod';

export const GetStocksQuerySchema = z
  .object({
    next: z.string().optional(),
    prev: z.string().optional(),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined))
      .refine((val) => val === undefined || (val > 0 && val <= 100), {
        message: 'Limit must be between 1 and 100',
      }),
    search: z.string().optional(),
    brokerage: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    sortField: z.enum(['time', 'action', 'brokerage']).optional(),
  })
  .refine((data) => !(data.next && data.prev), {
    message: 'Cannot provide both next and prev cursors',
    path: ['next', 'prev'],
  });

export const GetStockByIdParamsSchema = z.object({
  id: z.ulid(),
});

export type GetAllStocksQuery = z.infer<typeof GetStocksQuerySchema>;
export type GetStockByIdParams = z.infer<typeof GetStockByIdParamsSchema>;
