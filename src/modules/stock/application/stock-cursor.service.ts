import { AppError } from '../../shared/domain/errors/app.error';
import type { StockCursor } from '../domain/stock-cursor';

export class StockCursorService {
  static encode(cursor: StockCursor): string {
    return Buffer.from(cursor.id).toString('base64');
  }

  static decode(cursor: string): StockCursor {
    try {
      const id = Buffer.from(cursor, 'base64').toString('utf-8');

      if (!id || id.length < 1 || /[^\w-]/.test(id)) {
        throw new Error('Invalid cursor format');
      }

      return { id };
    } catch {
      throw new AppError({
        message: 'Invalid cursor format',
      });
    }
  }
}
